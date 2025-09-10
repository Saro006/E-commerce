from celery import shared_task
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from .models import Order, OrderItem
import logging

logger = logging.getLogger(__name__)


@shared_task
def send_order_confirmation_email(order_id: int, to_email: str):
    """
    Send order confirmation email with HTML template
    """
    try:
        # Get order details
        order = Order.objects.get(id=order_id)
        order_items = OrderItem.objects.filter(order=order)
        
        # Format order number (SK-0001, SK-0002, etc.)
        order_number = f"SK-{order.id:04d}"
        
        # Prepare context for email template
        context = {
            'order': order,
            'order_number': order_number,
            'order_items': order_items,
            'total_amount': order.total_amount,
            'site_name': 'SK Mart',
        }
        
        # Create HTML email content
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation - SK Mart</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #0d9488, #14b8a6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }}
                .order-info {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
                .order-item {{ display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #e5e7eb; }}
                .order-item:last-child {{ border-bottom: none; }}
                .item-details {{ flex: 1; }}
                .item-price {{ font-weight: bold; color: #0d9488; }}
                .total {{ font-size: 18px; font-weight: bold; color: #0d9488; text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #0d9488; }}
                .footer {{ text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }}
                .btn {{ display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Order Confirmed!</h1>
                    <p>Thank you for your purchase at SK Mart</p>
                </div>
                
                <div class="content">
                    <div class="order-info">
                        <h2>Order Details</h2>
                        <p><strong>Order Number:</strong> {order_number}</p>
                        <p><strong>Order Date:</strong> {order.created_at.strftime('%B %d, %Y at %I:%M %p')}</p>
                        <p><strong>Status:</strong> Confirmed</p>
                    </div>
                    
                    <div class="order-info">
                        <h3>Items Ordered</h3>
                        {''.join([f'''
                        <div class="order-item">
                            <div class="item-details">
                                <strong>{item.product.name}</strong><br>
                                <small>Quantity: {item.quantity} × ${item.unit_price:.2f}</small>
                            </div>
                            <div class="item-price">${(item.unit_price * item.quantity):.2f}</div>
                        </div>
                        ''' for item in order_items])}
                        
                        <div class="total">
                            Total Amount: ${order.total_amount:.2f}
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:5173/orders" class="btn">View Order History</a>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Thank you for shopping with SK Mart!</p>
                    <p>If you have any questions, please contact our support team.</p>
                    <p>© 2024 SK Mart. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Plain text version
        text_content = f"""
        Order Confirmation - SK Mart
        
        Order Number: {order_number}
        Order Date: {order.created_at.strftime('%B %d, %Y at %I:%M %p')}
        Status: Confirmed
        
        Items Ordered:
        {chr(10).join([f'- {item.product.name} (Qty: {item.quantity} × ${item.unit_price:.2f}) = ${(item.unit_price * item.quantity):.2f}' for item in order_items])}
        
        Total Amount: ${order.total_amount:.2f}
        
        Thank you for shopping with SK Mart!
        """
        
        # Create email
        subject = f"Order Confirmation - {order_number} | SK Mart"
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@skmart.com')
        
        # Send HTML email
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
        msg.attach_alternative(html_content, "text/html")
        
        result = msg.send()
        
        logger.info(f"Order confirmation email sent successfully to {to_email} for order {order_number}")
        return f"Email sent successfully to {to_email}"
        
    except Order.DoesNotExist:
        logger.error(f"Order {order_id} not found")
        return f"Order {order_id} not found"
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return f"Failed to send email: {str(e)}"



