from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from django.conf import settings
import os
from datetime import datetime


def generate_facture_pdf(transaction):
    """Génère une facture PDF pour une transaction"""
    
    # Créer le fichier PDF
    filename = f"facture_{transaction.numero_facture}.pdf"
    filepath = os.path.join(settings.MEDIA_ROOT, 'factures', filename)
    
    # S'assurer que le répertoire existe
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    # Créer le document
    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=18
    )
    
    # Styles
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name='CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#667eea'),
        spaceAfter=30,
        alignment=TA_CENTER
    ))
    
    styles.add(ParagraphStyle(
        name='CustomHeader',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.darkgrey,
        spaceAfter=10
    ))
    
    styles.add(ParagraphStyle(
        name='RightAlign',
        parent=styles['Normal'],
        alignment=TA_RIGHT
    ))
    
    # Contenu de la facture
    elements = []
    
    # En-tête
    elements.append(Paragraph("FACTURE", styles['CustomTitle']))
    elements.append(Spacer(1, 12))
    
    # Informations du magasin
    magasin_info = [
        ["Magasin Mobile", ""],
        ["123 Rue du Commerce", ""],
        ["75001 Paris", ""],
        ["Tél: 01 23 45 67 89", ""],
        ["Email: contact@magasin-mobile.fr", ""],
    ]
    
    magasin_table = Table(magasin_info, colWidths=[3*inch, 3*inch])
    magasin_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.darkgrey),
    ]))
    
    elements.append(magasin_table)
    elements.append(Spacer(1, 24))
    
    # Numéro de facture et date
    facture_info = [
        ["Numéro de facture:", transaction.numero_facture or "N/A"],
        ["Date:", transaction.date_transaction.strftime("%d/%m/%Y %H:%M")],
        ["Mode de paiement:", transaction.get_mode_paiement_display()],
    ]
    
    facture_table = Table(facture_info, colWidths=[2*inch, 4*inch])
    facture_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.darkgrey),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.black),
    ]))
    
    elements.append(facture_table)
    elements.append(Spacer(1, 24))
    
    # Informations client
    if transaction.client:
        client_info = [
            ["FACTURÉ À:", ""],
            [transaction.client.nom_complet, ""],
            [transaction.client.telephone, ""],
            [transaction.client.adresse or "", ""],
            [transaction.client.email or "", ""],
        ]
        
        client_table = Table(client_info, colWidths=[2*inch, 4*inch])
        client_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, 0), 'Helvetica-Bold'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('TEXTCOLOR', (0, 0), (0, 0), colors.HexColor('#667eea')),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ]))
        
        elements.append(client_table)
        elements.append(Spacer(1, 24))
    
    # Tableau des produits
    headers = ["Description", "Quantité", "Prix unitaire", "Total"]
    data = [headers]
    
    for ligne in transaction.lignes.all():
        description = ligne.produit.nom if ligne.produit else str(ligne.telephone_occasion)
        quantite = str(ligne.quantite)
        prix_unitaire = f"{float(ligne.prix_unitaire):.2f}€"
        total = f"{float(ligne.total):.2f}€"
        data.append([description, quantite, prix_unitaire, total])
    
    # Total
    data.append(["", "", "TOTAL", f"{float(transaction.montant_total):.2f}€"])
    
    produits_table = Table(data, colWidths=[3*inch, 1*inch, 1.5*inch, 1.5*inch])
    produits_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#667eea')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -2), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#f0f4ff')),
    ]))
    
    elements.append(produits_table)
    elements.append(Spacer(1, 36))
    
    # Informations de garantie
    if transaction.type_transaction == 'VENTE':
        garantie_info = Paragraph(
            "<b>Conditions de garantie:</b><br/>"
            "Les produits vendus bénéficient de la garantie légale de conformité de 2 ans.<br/>"
            "Pour toute réclamation, conservez cette facture et contactez notre service client.",
            styles['CustomHeader']
        )
        elements.append(garantie_info)
    
    # Pied de page
    elements.append(Spacer(1, 48))
    footer = Paragraph(
        "Merci de votre confiance ! • Magasin Mobile • www.magasin-mobile.fr",
        ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.grey,
            alignment=TA_CENTER
        )
    )
    elements.append(footer)
    
    # Générer le PDF
    doc.build(elements)
    
    return filepath