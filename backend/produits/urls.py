from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategorieProduitViewSet, basename='categorie')
router.register(r'produits', views.ProduitViewSet, basename='produit')
router.register(r'telephones-occasion', views.TelephoneOccasionViewSet, basename='telephone-occasion')

urlpatterns = [
    path('', include(router.urls)),
    path('public/catalog/', views.public_catalog, name='public-catalog'),
    path('public/categories/', views.public_categories, name='public-categories'),
]