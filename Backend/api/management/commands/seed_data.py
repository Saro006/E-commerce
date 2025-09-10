from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Category, Product


class Command(BaseCommand):
    help = "Seed initial categories, users, and products"

    def handle(self, *args, **options):
        # Users
        admin, created_admin = User.objects.get_or_create(username='admin', defaults={
            'email': 'admin@gmail.com',
            'is_staff': True,
            'is_superuser': True,
        })
        if created_admin:
            admin.set_password('admin')
            admin.save()

        user, created_user = User.objects.get_or_create(username='user', defaults={
            'email': 'user@example.com',
            'is_staff': False,
        })
        if created_user:
            user.set_password('user')
            user.save()

        # Categories
        cat1, _ = Category.objects.get_or_create(name='Electronics', defaults={'slug': 'electronics', 'description': 'Electronic devices and gadgets'})
        cat2, _ = Category.objects.get_or_create(name='Clothing', defaults={'slug': 'clothing', 'description': 'Fashion and apparel'})
        cat3, _ = Category.objects.get_or_create(name='Books', defaults={'slug': 'books', 'description': 'Books and literature'})

        products_data = [
            {'name': 'Smartphone', 'slug': 'smartphone', 'price': 599.99, 'stock': 50, 'description': 'Latest smartphone with advanced features', 'category': cat1},
            {'name': 'Laptop', 'slug': 'laptop', 'price': 1299.99, 'stock': 25, 'description': 'High-performance laptop for work and gaming', 'category': cat1},
            {'name': 'T-Shirt', 'slug': 't-shirt', 'price': 19.99, 'stock': 100, 'description': 'Comfortable cotton t-shirt', 'category': cat2},
            {'name': 'Jeans', 'slug': 'jeans', 'price': 49.99, 'stock': 75, 'description': 'Classic blue jeans', 'category': cat2},
            {'name': 'Programming Book', 'slug': 'programming-book', 'price': 39.99, 'stock': 30, 'description': 'Learn programming fundamentals', 'category': cat3},
        ]

        created = 0
        for data in products_data:
            obj, was_created = Product.objects.get_or_create(
                name=data['name'],
                defaults={
                    'slug': data['slug'],
                    'price': data['price'],
                    'stock': data['stock'],
                    'description': data['description'],
                    'category': data['category'],
                    'owner': admin,
                }
            )
            if was_created:
                created += 1

        self.stdout.write(self.style.SUCCESS(f'Seed complete. Users(admin/user) and {created} products ready.'))




