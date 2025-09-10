from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from .models import Category, Product, Cart, CartItem, Order


class EcommerceFlowTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='u1', password='pass', email='u1@example.com')
        self.admin = User.objects.create_user(username='admin1', password='pass', is_staff=True)
        self.cat = Category.objects.create(name='Cat', slug='cat')

    def auth(self, username='u1', password='pass'):
        url = '/api/auth/jwt/create/'
        res = self.client.post(url, { 'username': username, 'password': password }, format='json')
        self.assertEqual(res.status_code, 200)
        token = res.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def test_product_crud_and_order_flow(self):
        # Non-admin cannot create product
        self.auth('u1')
        res = self.client.post('/api/products/', {
            'name': 'P1', 'slug': 'p1', 'category': self.cat.id, 'price': '10.00', 'stock': 3
        }, format='json')
        self.assertEqual(res.status_code, 403)

        # Admin creates product
        self.client.credentials()
        self.auth('admin1')
        res = self.client.post('/api/products/', {
            'name': 'P1', 'slug': 'p1', 'category': self.cat.id, 'price': '10.00', 'stock': 3
        }, format='json')
        self.assertEqual(res.status_code, 201)
        prod_id = res.data['id']

        # User adds to cart and places order
        self.client.credentials()
        self.auth('u1')
        res = self.client.post('/api/cart/add/', { 'product': prod_id, 'quantity': 2 }, format='json')
        self.assertEqual(res.status_code, 200)
        res = self.client.post('/api/orders/', { 'shipping_address': 'addr' }, format='json')
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data['status'], 'paid')

# Create your tests here.
