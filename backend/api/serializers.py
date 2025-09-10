from rest_framework import serializers
from django.db import transaction
from django.contrib.auth.models import User

from .models import Category, Product, Cart, CartItem, Order, OrderItem


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "created_at", "updated_at"]


class ProductSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "name",
            "slug",
            "description",
            "image_url",
            "price",
            "stock",
            "is_active",
            "owner",
            "created_at",
            "updated_at",
        ]


class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.filter(is_active=True))
    product_name = serializers.ReadOnlyField(source="product.name")
    product_price = serializers.ReadOnlyField(source="product.price")
    product_image_url = serializers.ReadOnlyField(source="product.image_url")

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_price",
            "product_image_url",
            "quantity",
            "subtotal",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["product_name", "product_price", "product_image_url", "subtotal", "created_at", "updated_at"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "user", "items", "total_amount", "created_at", "updated_at"]
        read_only_fields = ["user", "items", "total_amount", "created_at", "updated_at"]

    def get_total_amount(self, obj):
        return obj.total_amount


class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(read_only=True)
    product_name = serializers.ReadOnlyField(source="product.name")
    product_price = serializers.ReadOnlyField(source="product.price")
    product_image_url = serializers.ReadOnlyField(source="product.image_url")

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_price",
            "product_image_url",
            "unit_price",
            "quantity",
            "subtotal",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["product_name", "product_price", "product_image_url", "unit_price", "subtotal", "created_at", "updated_at"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "status",
            "total_amount",
            "payment_reference",
            "shipping_address",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "status", "total_amount", "payment_reference", "created_at", "updated_at"]


class OrderCreateSerializer(serializers.Serializer):
    shipping_address = serializers.CharField(allow_blank=True, required=False)

    @transaction.atomic
    def create(self, validated_data):
        request = self.context["request"]
        user = request.user
        cart, _ = Cart.objects.get_or_create(user=user)
        items = list(cart.items.select_related("product"))
        if not items:
            raise serializers.ValidationError({"cart": "Cart is empty"})

        order = Order.objects.create(
            user=user,
            status="pending",
            total_amount=0,
            shipping_address=validated_data.get("shipping_address", ""),
        )
        total = 0
        for item in items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                unit_price=item.product.price,
                quantity=item.quantity,
            )
            total += item.product.price * item.quantity

        order.total_amount = total
        # Mock payment success
        order.status = "paid"
        order.payment_reference = f"mock_{order.id}"
        order.save()

        # Clear cart
        cart.items.all().delete()

        return order


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )
        # Create empty cart for user
        Cart.objects.get_or_create(user=user)
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email"]

    def validate_username(self, value):
        user = self.instance
        if value and User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        user = self.instance
        if value and User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

