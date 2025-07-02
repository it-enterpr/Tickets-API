from fastapi import FastAPI, HTTPException
import odoorpc
from .schemas import (
    OdooCredentials, 
    TripDetailRequest, 
    MyTicketsRequest, 
    SetVisibilityRequest,
    TripsByDateRequest,
    TripSearchRequest
)

app = FastAPI(title="Odoo Connector")


@app.post("/get_trips_by_date")
def get_trips_by_date(payload: TripsByDateRequest):
    """
    Získá z Odoo seznam jízd pro konkrétní datum.
    """
    try:
        odoo = odoorpc.ODOO(payload.url, protocol='jsonrpc+ssl', port=443)
        odoo.login(payload.db, payload.username, payload.password)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Odoo Connection Error: {e}")

    Trip = odoo.env['sh.bus.trip']
    domain = [('trip_date', '=', payload.date)]
    trip_ids = Trip.search(domain, order='route')
    
    if not trip_ids:
        return []

    fields_to_read = ['route', 'bus_id', 'trip_date', 'seats_booked', 'total_seat', 'is_active_for_sale']
    trips_data = Trip.read(trip_ids, fields_to_read)
    
    formatted_trips = [
        {
            "trip_id": trip.get('id'),
            "route_id": trip.get('route')[0] if trip.get('route') else None,
            "route_name": trip.get('route')[1] if trip.get('route') else "N/A",
            "bus_name": trip.get('bus_id')[1] if trip.get('bus_id') else "N/A",
            "trip_date": str(trip.get('trip_date')),
            "seats_booked": trip.get('seats_booked'),
            "seats_total": trip.get('total_seat'),
            "is_active_for_sale": trip.get('is_active_for_sale'),
        }
        for trip in trips_data
    ]
    return formatted_trips


@app.post("/get_trip_passengers")
def get_trip_passengers(payload: TripDetailRequest):
    """
    Pro danou JÍZDU (trip) vrátí seznam pasažérů.
    """
    try:
        odoo = odoorpc.ODOO(payload.url, protocol='jsonrpc+ssl', port=443)
        odoo.login(payload.db, payload.username, payload.password)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Odoo Connection/Login Error: {e}")

    SaleOrderLine = odoo.env['sale.order.line']
    domain = [('order_id.trip_id', '=', payload.trip_id)]
    fields_to_read = ['p_name', 'seat', 'p_email', 'order_partner_id']
    
    ticket_lines = SaleOrderLine.search_read(domain, fields_to_read)

    passengers_list = [
        {
            "passenger_name": line.get('p_name'),
            "seat_number": line.get('seat'),
            "customer_name": line.get('order_partner_id')[1] if line.get('order_partner_id') else "N/A",
            "passenger_email": line.get('p_email'),
        }
        for line in ticket_lines
    ]
    return passengers_list


@app.post("/set_trip_visibility")
def set_trip_visibility(payload: SetVisibilityRequest):
    """
    Nastaví viditelnost pro konkrétní jízdu v Odoo.
    """
    try:
        odoo = odoorpc.ODOO(payload.url, protocol='jsonrpc+ssl', port=443)
        odoo.login(payload.db, payload.username, payload.password)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Odoo Connection/Login Error: {e}")

    Trip = odoo.env['sh.bus.trip']
    try:
        Trip.write([payload.trip_id], {'is_active_for_sale': payload.is_visible})
        return {"status": "success", "trip_id": payload.trip_id, "visibility_set_to": payload.is_visible}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Odoo write operation failed: {e}")


@app.post("/get_my_tickets")
def get_my_tickets(payload: MyTicketsRequest):
    """
    Najde v Odoo zákazníka podle e-mailu a vrátí jeho jízdenky.
    """
    try:
        odoo = odoorpc.ODOO(payload.url, protocol='jsonrpc+ssl', port=443)
        odoo.login(payload.db, payload.username, payload.password)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Odoo Connection/Login Error: {e}")

    Partner = odoo.env['res.partner']
    partner_ids = Partner.search([('email', '=', payload.user_email)])
    if not partner_ids: return []

    partner_id = partner_ids[0]
    SaleOrder = odoo.env['sale.order']
    order_ids = SaleOrder.search([('partner_id', '=', partner_id), ('trip_id', '!=', False)])
    if not order_ids: return []

    orders_data = SaleOrder.read(order_ids, ['name', 'date_order', 'amount_total', 'trip_id'])
    tickets = []
    for order in orders_data:
        trip_info_list = odoo.env['sh.bus.trip'].read(order['trip_id'][0], ['route', 'trip_date', 'bus_id']) if order.get('trip_id') else []
        trip_info = trip_info_list[0] if trip_info_list else {}
        tickets.append({"ticket_id": order.get('name'),"purchase_date": str(order.get('date_order')),"total_price": order.get('amount_total'),"route_name": trip_info.get('route')[1] if trip_info.get('route') else "N/A","trip_date": str(trip_info.get('trip_date')),"bus_name": trip_info.get('bus_id')[1] if trip_info.get('bus_id') else "N/A"})
    return tickets


@app.post("/get_user_role")
def get_user_role(payload: MyTicketsRequest):
    """
    Zjistí v Odoo, zda je uživatel s daným e-mailem interní.
    """
    try:
        odoo = odoorpc.ODOO(payload.url, protocol='jsonrpc+ssl', port=443)
        odoo.login(payload.db, payload.username, payload.password)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Odoo Connection/Login Error: {e}")
    try:
        Users = odoo.env['res.users']
        internal_user_group_id = odoo.env.ref('base.group_user').id
        domain = [('login', '=', payload.user_email), ('groups_id', 'in', [internal_user_group_id])]
        user_count = Users.search_count(domain)
        return {"role": "internal"} if user_count > 0 else {"role": "client"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking user groups in Odoo: {e}")


@app.post("/get_bus_points")
def get_bus_points(creds: OdooCredentials):
    """
    Získá seznam všech autobusových zastávek z Odoo.
    """
    try:
        odoo = odoorpc.ODOO(creds.url, protocol='jsonrpc+ssl', port=443)
        odoo.login(creds.db, creds.username, creds.password)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Odoo Connection/Login Error: {e}")

    BusPoint = odoo.env['sh.bus.point']
    point_ids = BusPoint.search([])
    points_data = BusPoint.read(point_ids, ['id', 'name'])
    return points_data


@app.post("/search_trips")
def search_trips(payload: TripSearchRequest):
    """
    Vyhledá v Odoo jízdy podle zadaných kritérií.
    """
    try:
        odoo = odoorpc.ODOO(payload.url, protocol='jsonrpc+ssl', port=443)
        odoo.login(payload.db, payload.username, payload.password)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Odoo Connection/Login Error: {e}")
        
    Trip = odoo.env['sh.bus.trip']
    domain = [
        ('trip_date', '=', payload.date),
        ('is_active_for_sale', '=', True),
        ('bording_from', '=', payload.from_location_id),
        ('to', '=', payload.to_location_id)
    ]
    trip_ids = Trip.search(domain, order='trip_start_time')
    if not trip_ids:
        return []
    fields_to_read = ['id', 'route', 'bus_id', 'trip_date', 'trip_start_time', 'trip_end_time', 'price', 'remaining_seats']
    trips_data = Trip.read(trip_ids, fields_to_read)
    formatted_trips = [{"trip_id": trip.get('id'),"route_name": trip.get('route')[1] if trip.get('route') else "N/A","bus_name": trip.get('bus_id')[1] if trip.get('bus_id') else "N/A","trip_date": str(trip.get('trip_date')),"departure_time": '{0:02.0f}:{1:02.0f}'.format(*divmod(trip.get('trip_start_time') * 60, 60)),"arrival_time": '{0:02.0f}:{1:02.0f}'.format(*divmod(trip.get('trip_end_time') * 60, 60)),"price": trip.get('price'),"seats_available": trip.get('remaining_seats')} for trip in trips_data]
    return formatted_trips