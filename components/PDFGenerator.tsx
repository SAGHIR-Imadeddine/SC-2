import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { Product } from '~/types/types';

type PDFAction = 'share' | 'download';

export const generateProductPDF = async (product: Product, action: PDFAction = 'share') => {
  const totalQuantity = product.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  const firstEdit = product.editedBy[0];
  const lastEdit = product.editedBy[product.editedBy.length - 1];

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body { font-family: 'Helvetica'; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .product-image { max-width: 300px; margin: 0 auto; display: block; }
          .section { margin-bottom: 20px; }
          .section-title { color: #12435a; font-size: 18px; margin-bottom: 10px; }
          .info-row { display: flex; margin-bottom: 8px; }
          .label { font-weight: bold; min-width: 120px; }
          .value { flex: 1; }
          .stock-item { margin-bottom: 15px; padding: 10px; background: #f5f5f5; }
          .edit-info { color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${product.name}</h1>
          ${product.image ? `<img src="${product.image}" class="product-image"/>` : ''}
        </div>

        <div class="section">
          <h2 class="section-title">Product Information</h2>
          <div class="info-row">
            <span class="label">Type:</span>
            <span class="value">${product.type}</span>
          </div>
          <div class="info-row">
            <span class="label">Barcode:</span>
            <span class="value">${product.barcode}</span>
          </div>
          <div class="info-row">
            <span class="label">Price:</span>
            <span class="value">${product.price} Dh</span>
          </div>
          ${product.solde ? `
          <div class="info-row">
            <span class="label">Solde Price:</span>
            <span class="value">${product.solde} Dh</span>
          </div>
          ` : ''}
          <div class="info-row">
            <span class="label">Supplier:</span>
            <span class="value">${product.supplier}</span>
          </div>
          <div class="info-row">
            <span class="label">Total Quantity:</span>
            <span class="value">${totalQuantity} units</span>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Stock Distribution</h2>
          ${product.stocks.map(stock => `
            <div class="stock-item">
              <div class="info-row">
                <span class="label">Warehouse:</span>
                <span class="value">${stock.name}</span>
              </div>
              <div class="info-row">
                <span class="label">Quantity:</span>
                <span class="value">${stock.quantity} units</span>
              </div>
              <div class="info-row">
                <span class="label">Location:</span>
                <span class="value">${stock.localisation.city}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2 class="section-title">Product History</h2>
          <div class="edit-info">
            <p>Created by ID: ${firstEdit.warehousemanId}</p>
            <p>Creation Date: ${new Date(firstEdit.at).toLocaleDateString()}</p>
            ${lastEdit && lastEdit !== firstEdit ? `<p>Last Modified by ID: ${lastEdit.warehousemanId}</p>
            <p>Last Modified Date: ${new Date(lastEdit.at).toLocaleDateString()}</p>` : ''}
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    // Generate PDF file
    const file = await Print.printToFileAsync({
      html: htmlContent,
      base64: false
    });

    // For both share and download
    await Sharing.shareAsync(file.uri, {
      UTI: '.pdf',
      mimeType: 'application/pdf',
      dialogTitle: action === 'download' ? 'Save PDF' : 'Share PDF'
    });

    return true;
  } catch (error) {
    console.error('Error handling PDF:', error);
    Alert.alert(
      'Error',
      'Failed to ' + (action === 'download' ? 'save' : 'share') + ' PDF'
    );
    return false;
  }
}; 