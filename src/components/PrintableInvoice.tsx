import React from 'react';
import { Sale, Customer, Product } from '../types';

interface PrintableInvoiceProps {
  receiptId: string;
  date: string;
  customer?: Customer | null;
  customerName: string;
  items: Sale[];
  total: number;
  currency: string;
  products: Product[];
  template?: string;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({
  receiptId,
  date,
  customer,
  customerName,
  items,
  total,
  currency,
  products,
  template
}) => {
  const paidAmount = items.reduce((sum, item) => sum + (item.paidAmount || 0), 0);
  const remainingBalance = total - paidAmount;
  const paymentMethod = items[0]?.paymentMethod === 'cash' ? 'نەقد' : 'قیست';
  const driverName = items[0]?.driverName || '';
  const note = items[0]?.note || '';

  if (template) {
    const itemsTableHtml = items.map((item, index) => {
      const product = products.find(p => p.name === item.itemName);
      return `
        <tr>
          <td>${item.total.toLocaleString()}</td>
          <td>${(item.total / item.quantity).toLocaleString()}</td>
          <td>${item.quantity}</td>
          <td>${product?.unit || '---'}</td>
          <td>---</td>
          <td>${item.itemName}</td>
          <td>${index + 1}</td>
        </tr>
      `;
    }).join('');

    let processedTemplate = template
      .replace(/{{receiptId}}/g, receiptId)
      .replace(/{{date}}/g, date)
      .replace(/{{customerId}}/g, customer?.id?.toString() || '---')
      .replace(/{{customerName}}/g, customerName)
      .replace(/{{customerPhone}}/g, customer?.phone || '---')
      .replace(/{{itemsTable}}/g, itemsTableHtml)
      .replace(/{{total}}/g, total.toLocaleString())
      .replace(/{{currency}}/g, currency)
      .replace(/{{paidAmount}}/g, paidAmount.toLocaleString())
      .replace(/{{remainingBalance}}/g, remainingBalance.toLocaleString())
      .replace(/{{customerDebt}}/g, customer ? customer.debt.toLocaleString() : '---')
      .replace(/{{paymentMethod}}/g, paymentMethod)
      .replace(/{{driverName}}/g, driverName)
      .replace(/{{note}}/g, note);

    return <div dangerouslySetInnerHTML={{ __html: processedTemplate }} />;
  }

  return (
    <div className="invoice-paper font-sans" dir="rtl">
      <style>{`
        .invoice-paper {
            background-color: #fff;
            padding: 20px;
            width: 148mm; 
            min-height: 210mm; 
            margin-left: auto;
            margin-right: auto;
            box-sizing: border-box;
            color: #000;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #000;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        .header-text { width: 35%; line-height: 1.2; font-size: 12px; }
        .header-logo { width: 30%; text-align: center; }
        .header-logo svg { width: 40px; height: 40px; margin: 0 auto; }
        .header-logo p { margin: 2px 0; font-weight: bold; font-size: 11px; }
        .header h3 { margin: 0; font-size: 16px; font-weight: bold; }
        .header p { margin: 2px 0; }

        .invoice-title-container { border-bottom: 1px solid #000; margin-bottom: 15px; padding-bottom: 10px;}
        .invoice-title {
            background-color: #e0e0e0;
            padding: 2px 10px;
            font-weight: bold;
            border: 1px solid #000;
            width: fit-content;
            margin-top: 5px;
        }

        .info-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .info-box {
            border: 1px solid #000;
            padding: 5px 10px;
            width: 47%;
            border-radius: 5px;
            line-height: 1.6;
        }
        .gray-bg { background-color: #e0e0e0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            text-align: center;
            font-size: 12px;
        }
        .invoice-table, .invoice-table th, .invoice-table td { border: 1px solid #000; }
        .invoice-table th { background-color: #f0f0f0; padding: 4px; font-weight: normal; -webkit-print-color-adjust: exact; print-color-adjust: exact;}
        .invoice-table td { padding: 4px; height: 25px; }

        .bottom-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            font-size: 12px;
        }

        .totals-details { width: 45%; border: 1px solid #000; }
        .totals-details div {
            display: flex;
            justify-content: space-between;
            padding: 3px 5px;
            border-bottom: 1px solid #000;
        }
        .totals-details div:last-child { border-bottom: none; }
        .totals-details .bold-total { background-color: #e0e0e0; font-weight: bold; -webkit-print-color-adjust: exact; print-color-adjust: exact;}

        .payment-details { width: 45%; border: 1px solid #000; border-radius: 5px; overflow: hidden; }
        .payment-title { text-align: center; background: #e0e0e0; padding: 3px; border-bottom: 1px solid #000; font-weight: bold; -webkit-print-color-adjust: exact; print-color-adjust: exact;}
        .payment-details div { display: flex; justify-content: space-between; padding: 3px 5px; min-height: 20px;}

        .footer-notes { margin-top: 10px; font-size: 12px;}
        .notes-box {
            border: 1px solid #000;
            background-color: #e0e0e0;
            width: 150px;
            float: left;
            text-align: right;
            border-radius: 5px;
            overflow: hidden;
            min-height: 60px;
            -webkit-print-color-adjust: exact; print-color-adjust: exact;
        }
        .notes-title { background:#000; color:#fff; text-align:center; padding:2px; font-weight:bold; -webkit-print-color-adjust: exact; print-color-adjust: exact;}
        .notes-content { padding: 5px; text-align: right; }
        
        .signatures { clear: both; padding-top: 30px; display: flex; justify-content: space-between; font-size: 12px;}

        @media print {
            .invoice-paper { 
                width: 100%; 
                margin: 0; 
                padding: 10px;
                box-shadow: none; 
                border: none; 
            }
        }
      `}</style>
        
        <div className="header">
            <div className="header-text" style={{ textAlign: 'right' }}>
                <h3>البان موراد</h3>
                <p>بۆ بەرهەمە شیرەمەنییەکان</p>
                <p>هەولێر - ٤٠ مەتری</p>
                <p>ژمارەی کۆمپانیا: </p>
            </div>
            
            <div className="header-logo">
                <svg width="40" height="40" viewBox="0 0 100 100"><path fill="#555" d="M50 0c27.6 0 50 22.4 50 50s-22.4 50-50 50S0 77.6 0 50 22.4 0 50 0zm0 20c-16.5 0-30 13.5-30 30s13.5 30 30 30 30-13.5 30-30-13.5-30-30-30zm-5 15h10v30H45V35z"/></svg>
                <p>ALBAN MURAD</p>
            </div>

            <div className="header-text" style={{ textAlign: 'left', direction: 'ltr' }}>
                <h3 style={{ textAlign: 'right', direction: 'rtl' }}>البان موراد</h3>
                <p>0750 445 16 72</p>
                <p>0770 445 16 72</p>
                <p>0750 878 80 55</p>
            </div>
        </div>

        <div className="invoice-title-container">
            <div className="invoice-title">ڕقم <span>{receiptId}</span></div>
        </div>

        <div className="info-container">
            <div className="info-box">
                <div><strong>پسوولە - فرۆشتن</strong></div>
                <div>ڕێکەوتی پسوولە: <span>{date}</span></div>
                <div>کۆپی: بنەڕەت (ئەسڵی)</div>
            </div>
            <div className="info-box" style={{ border: 'none', padding: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #000', paddingBottom: '5px' }}>
                    <div>کۆدی کڕیار: <span className="gray-bg" style={{ padding: '0 15px' }}>&nbsp;&nbsp;&nbsp;{customer?.id || '---'}&nbsp;&nbsp;&nbsp;</span></div>
                    <div>ناوی کڕیار: <strong>{customerName}</strong></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '5px' }}>
                    <div>مۆبایل: <span>{customer?.phone || '---'}</span></div>
                </div>
            </div>
        </div>

        <table className="invoice-table">
            <thead>
                <tr>
                    <th>کۆی گشتی</th>
                    <th>نرخی یەکە</th>
                    <th>بڕ</th>
                    <th>یەکە</th>
                    <th>پێچانەوە</th>
                    <th>ناوی کاڵا</th>
                    <th>ژمارە</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, index) => {
                    const product = products.find(p => p.name === item.itemName);
                    return (
                        <tr key={index}>
                            <td>{item.total.toLocaleString()}</td>
                            <td>{(item.total / item.quantity).toLocaleString()}</td>
                            <td>{item.quantity}</td>
                            <td>{product?.unit || '---'}</td>
                            <td>---</td>
                            <td>{item.itemName}</td>
                            <td>{index + 1}</td>
                        </tr>
                    );
                })}
                {/* Fill empty rows to maintain height if needed, but React map is dynamic */}
                {items.length < 8 && Array.from({ length: 8 - items.length }).map((_, i) => (
                    <tr key={`empty-${i}`}>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="bottom-section">
            <div className="totals-details">
                <div><span>کۆی گشتی:</span> <span>{total.toLocaleString()} {currency}</span></div>
                <div><span>بڕی داشکاندن:</span> <span>0</span></div>
                <div><span>ڕێژەی داشکاندن %:</span> <span>0</span></div>
                <div><span>بڕ دوای داشکاندن:</span> <span>{total.toLocaleString()}</span></div>
                <div><span>ڕێژەی باج %:</span> <span>0</span></div>
                <div className="bold-total"><span>کۆی گشتیی پسوولە:</span> <strong>{total.toLocaleString()} {currency}</strong></div>
                <div style={{ textAlign: 'center', fontSize: '11px', border: 'none', display: 'block', paddingTop: '10px', minHeight: '15px' }}>
                    {/* Placeholder for amount in words */}
                </div>
            </div>

            <div className="payment-details">
                <div className="payment-title">تفاصيل الدفع (وردەکاری پارەدان)</div>
                <div><span>نەقد:</span> <strong className="gray-bg" style={{ padding: '0 15px' }}>{paidAmount.toLocaleString()}</strong></div>
                <div><span>ژمارەی وەسڵ: </span> <span>{receiptId}</span></div>
                <div><span>لەسەر حیساب:</span> <span>{paymentMethod === 'قیست' ? (total - paidAmount).toLocaleString() : '0'}</span></div>
                <div><span>باڵانسی ماوە:</span> <span>{customer ? customer.debt.toLocaleString() : '---'}</span></div>
            </div>
        </div>

        <div className="footer-notes">
            <p style={{ float: 'right' }}><strong>ناوی مەندوب:</strong> <span>{driverName}</span><br /><strong>ژمارەی مۆبایل:</strong> <span></span></p>
            
            <div className="notes-box">
                <div className="notes-title">ملاحظات</div>
                <div className="notes-content">
                    {items[0]?.note || ''}
                </div>
            </div>
        </div>

        <div className="signatures">
            <p><strong>واژووی کڕیار (المستلم):</strong> .....................................</p>
            <p><strong>واژووی کۆمپانیا (التوقيع):</strong> .....................................</p>
        </div>

    </div>
  );
};
