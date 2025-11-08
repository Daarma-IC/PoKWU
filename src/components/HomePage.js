import React, { useState, useEffect } from 'react';
import qrisImage from '../image/qris.jpeg';

// --- Komponen Halaman Utama ---
const HomePage = ({ onWidgetClick }) => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1 className="homepage-title">Selamat Datang di Toko Kami</h1>
        <p className="homepage-subtitle">Jangan lewatkan kesempatan untuk mendapatkan produk nikmat kami.</p>
      </header>
      
      <div className="registration-cards-wrapper">
        <div className="widget-card" onClick={onWidgetClick}>
          <div className="widget-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a6 6 0 01-5.84 7.38v-4.82m0 0l3.37-3.37m0 0a6 6 0 012.25 4.16M12 12l3.37-3.37m0 0a6 6 0 014.16 2.25m0 0l3.37 3.37m0 0a6 6 0 01-7.38 5.84m-2.56-5.84a6 6 0 017.38 5.84m0 0l-3.37 3.37" />
            </svg>
          </div>
          <h2 className="widget-title">Pre-Order Dibuka!</h2>
          <p className="widget-description">
            Klik di sini untuk melakukan pemesanan produk kami. Stok terbatas!
          </p>
          <div className="widget-button">
            Pesan Sekarang
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Komponen Loading Modal ---
const LoadingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <h2 className="loading-title">Mengirim Pesanan...</h2>
        <p className="loading-description">
          Mohon tunggu, data Anda sedang diproses
        </p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

// --- Komponen Halaman Pre-Order ---
const PreOrderPage = ({ onBack, onSuccess }) => { 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    product: '',
    quantity: 1,
    proof: null,
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, proof: e.target.files[0] }));
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.proof) {
      alert('Mohon unggah bukti pembayaran.'); 
      return;
    }
    
    if (formData.quantity < 1) {
      alert('Kuantitas minimal 1!');
      return;
    }
    
    setIsSubmitting(true);
    
    const reader = new FileReader();
    reader.readAsDataURL(formData.proof);
    reader.onload = () => {
      const fileData = reader.result.split('base64,')[1];
      
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        product: formData.product,
        quantity: formData.quantity,
        fileName: formData.proof.name,
        mimeType: formData.proof.type,
        fileData: fileData
      };

      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwzXvgqZFvk1ZGYkcxzyYgpGzBYZjWr8teZ53N3ZP-QtJhX5BPuDF3IW3RQKYzgXpsY/exec";
      fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload)
      })
      .then(res => {
        onSuccess(); 
        e.target.reset();
        setFormData({ name: '', email: '', phone: '', product: '', quantity: 1, proof: null });
      })
      .catch(err => {
        console.error("Error sending data:", err);
        alert('Terjadi kesalahan, mohon coba lagi.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
    };

    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert('Gagal membaca file, mohon coba lagi.');
        setIsSubmitting(false);
    }
  };

  return (
    <div className="preorder-container">
      <button onClick={onBack} className="back-button">
        &larr; Kembali
      </button>
      <div className="form-card">
        <h1 className="form-title">Formulir Pre-Order</h1>
        <p className="form-subtitle">
          Isi data di bawah untuk mengamankan pesanan Anda!
        </p>
        <form onSubmit={handleFormSubmit}>
          <div className="input-group">
            <label htmlFor="name">Nama Lengkap</label>
            <input type="text" id="name" placeholder="Masukkan nama Anda" onChange={handleInputChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="email">Alamat Email</label>
            <input type="email" id="email" placeholder="contoh@email.com" onChange={handleInputChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="phone">Nomor Telepon</label>
            <input type="tel" id="phone" placeholder="Contoh: 08123456789" onChange={handleInputChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="product">Pilihan Produk</label>
            <select id="product" onChange={handleInputChange} required>
              <option value="">-- Pilih Produk --</option>
              <option value="Dimsum Original - Rp 18.000">Dimsum Original - Rp 18.000</option>
              <option value="Dimsum Mentai - Rp 20.000">Dimsum Mentai - Rp 20.000</option>
              <option value="Paket Bundel Special Original - Rp 22.000">Paket Bundel Special Original - Rp 22.000</option>
              <option value="Paket Bundel Special Mentai - Rp 25.000">Paket Bundel Special Mentai - Rp 25.000</option>
            </select>
          </div>
          
          {/* Quantity Input dengan Tombol + dan - */}
          <div className="input-group">
            <label htmlFor="quantity">Jumlah Pesanan Anda</label>
            <div className="quantity-input-wrapper">
              <button 
                type="button" 
                className="quantity-btn quantity-btn-minus" 
                onClick={() => {
                  const newQty = Math.max(1, (formData.quantity || 1) - 1);
                  setFormData(prev => ({ ...prev, quantity: newQty }));
                }}
              >
                −
              </button>
              <input 
                type="number" 
                id="quantity" 
                min="1" 
                value={formData.quantity} 
                placeholder="1" 
                onChange={handleInputChange} 
                required 
                className="quantity-input"
              />
              <button 
                type="button" 
                className="quantity-btn quantity-btn-plus" 
                onClick={() => {
                  const newQty = (formData.quantity || 1) + 1;
                  setFormData(prev => ({ ...prev, quantity: newQty }));
                }}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="qris-container">
            <label>Scan untuk Membayar</label>
            <label>Mohon untuk ditampilkan rincian lengkapnya </label>
            <div className="qris-placeholder">
              <img src={qrisImage} alt="Scan QRIS untuk pembayaran" style={{ width: '150px', height: 'auto', borderRadius: '8px' }} />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="proof">Upload Bukti Pembayaran</label>
            <input type="file" id="proof" name="proof" accept="image/*" onChange={handleFileChange} required />
          </div>
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="button-spinner"></span>
                Mengirim...
              </>
            ) : 'Kirim Pesanan'}
          </button>
        </form>
      </div>
      
      <LoadingModal isOpen={isSubmitting} />
      
    </div>
  );
};

// --- Komponen Modal Keberhasilan ---
const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="modal-title">Pesanan Terkirim!</h2>
        <p className="modal-description">
          Terima kasih! Pesanan anda akan kami proses.
        </p>
        <button className="modal-button" onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    setCurrentPage('home');
    setShowSuccessModal(false);
    sessionStorage.clear();
    localStorage.clear();
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const handleOrderSuccess = () => {
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigateTo('home'); 
  };

  return (
    <div className="App">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        body { margin: 0; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; background-color: #F0F2F5; color: #333; }
        .App { text-align: center; position: relative; width: 100vw; height: 100vh; overflow: hidden; }
        .page-container { 
          position: absolute; 
          width: 100%; 
          height: 100%; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: flex-start;
          padding: 5rem 20px;
          box-sizing: border-box; 
          transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out; 
          overflow-y: auto;
        }
        .page-container.hidden { opacity: 0; transform: translateY(20px); pointer-events: none; }
        .page-container.visible { opacity: 1; transform: translateY(0); }
        .homepage-container { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; }
        .homepage-header { margin-bottom: 40px; max-width: 600px; }
        .homepage-title { font-size: 2.5rem; font-weight: 800; color: #2c3e50; margin: 0 0 10px 0; }
        .homepage-subtitle { font-size: 1.1rem; color: #6c7a89; margin: 0; }
        .registration-cards-wrapper { display: flex; justify-content: center; margin-bottom: 30px; }
        .widget-card { background: linear-gradient(145deg, #4CAF50, #388E3C); border-radius: 15px; padding: 30px; width: 100%; max-width: 300px; cursor: pointer; border: none; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15); transition: transform 0.3s ease, box-shadow 0.3s ease; position: relative; overflow: hidden; text-align: center; color: white; }
        .widget-card:hover { transform: translateY(-8px); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25); }
        .widget-icon { width: 50px; height: 50px; margin: 0 auto 20px auto; background-color: rgba(255, 255, 255, 0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; }
        .widget-icon svg { width: 28px; height: 28px; stroke-width: 2; }
        .widget-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 10px 0; color: #ffffff; }
        .widget-description { color: #e0e0e0; line-height: 1.6; margin-bottom: 25px; font-size: 0.95rem; }
        .widget-button { background-color: rgba(0, 0, 0, 0.1); color: white; padding: 10px 20px; border-radius: 30px; font-weight: 600; transition: background-color 0.3s ease; border: 1px solid rgba(255, 255, 255, 0.3); }
        .widget-card:hover .widget-button { background-color: rgba(0, 0, 0, 0.2); }
        .preorder-container { width: 100%; max-width: 500px; position: relative; padding-bottom: 5rem; }
        .back-button { position: absolute; top: -40px; left: 0; background: none; border: none; color: #6c7a89; font-size: 1rem; cursor: pointer; transition: color 0.2s ease; z-index: 10; display: flex; align-items: center; gap: 5px; }
        .back-button:hover { color: #3B82F6; }
        .form-card { background-color: #ffffff; padding: 30px; border-radius: 15px; border: 1px solid #e0e6ed; width: 100%; box-sizing: border-box; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08); }
        .form-title { margin: 0 0 5px 0; font-size: 2rem; font-weight: 800; color: #2c3e50; }
        .form-subtitle { margin: 0 0 30px 0; color: #6c7a89; }
        .input-group { margin-bottom: 20px; text-align: left; }
        .input-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50; }
        .input-group input, .input-group select { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #e0e6ed; background-color: #f9fbfd; color: #333; font-size: 1rem; box-sizing: border-box; transition: border-color 0.2s ease; }
        .input-group input:focus, .input-group select:focus { outline: none; border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); }
        .input-group input::placeholder { color: #9ca3af; }
        
        /* Quantity Input dengan Tombol + dan - */
        .quantity-input-wrapper {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1px solid #e0e6ed;
          border-radius: 8px;
          background-color: #f9fbfd;
          overflow: hidden;
        }

        .quantity-btn {
          width: 45px;
          height: 48px;
          border: none;
          background-color: #3B82F6;
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .quantity-btn:hover {
          background-color: #2563EB;
        }

        .quantity-btn:active {
          transform: scale(0.95);
        }

        .quantity-btn-minus {
          border-radius: 8px 0 0 8px;
        }

        .quantity-btn-plus {
          border-radius: 0 8px 8px 0;
        }

        .quantity-input {
          flex: 1;
          text-align: center;
          border: none !important;
          background-color: #f9fbfd !important;
          padding: 12px 8px !important;
          font-size: 1.1rem;
          font-weight: 600;
          box-shadow: none !important;
          -moz-appearance: textfield;
        }

        .quantity-input::-webkit-outer-spin-button,
        .quantity-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .quantity-input:focus {
          outline: none;
          box-shadow: none !important;
        }
        
        .qris-container { text-align: center; margin: 25px 0; padding: 20px; background-color: #f9fbfd; border-radius: 8px; border: 1px dashed #e0e6ed; }
        .qris-container label { font-weight: 600; color: #2c3e50; display: block; margin-bottom: 15px; text-align: center; }
        .qris-placeholder { display: inline-block; padding: 10px; background-color: white; border-radius: 4px; border: 1px solid #e0e6ed; }
        .input-group input[type="file"] { background-color: #f9fbfd; border: 1px solid #e0e6ed; border-radius: 8px; padding: 8px; width: 100%; box-sizing: border-box; color: #6c7a89; font-family: 'Inter', sans-serif; }
        .input-group input[type="file"]::file-selector-button { margin-right: 15px; border: none; background: #3B82F6; padding: 8px 12px; border-radius: 4px; color: #fff; cursor: pointer; transition: background-color .2s ease-in-out; }
        .input-group input[type="file"]::file-selector-button:hover { background: #2563EB; }
        .submit-button { width: 100%; padding: 15px; border: none; border-radius: 8px; background-color: #4CAF50; color: white; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: background-color 0.3s ease, transform 0.1s ease; margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .submit-button:hover { background-color: #45a049; transform: translateY(-2px); }
        .submit-button:disabled { background-color: #cccccc; cursor: not-allowed; transform: none; }

        .button-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .loading-overlay {
          position: fixed;
          top: 60%;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          pointer-events: none; /* Biar background tetap bisa diklik (kalau mau) */
        }

        .loading-card {
          background-color: white;
          padding: 50px 40px;
          border-radius: 20px;
          width: 100%;
          max-width: 380px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          animation: modal-appear 0.3s ease-out;
          pointer-events: all; /* Cuma card yang bisa diklik */
        }

        .loading-spinner {
          width: 80px;
          height: 80px;
          margin: 0 auto 25px auto;
        }

        .spinner {
          width: 80px;
          height: 80px;
          border: 6px solid #f3f4f6;
          border-top-color: #4CAF50;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 10px 0;
        }

        .loading-description {
          color: #6b7280;
          margin-bottom: 25px;
          line-height: 1.5;
        }

        .loading-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .loading-dots span {
          width: 10px;
          height: 10px;
          background-color: #4CAF50;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(17, 24, 39, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal-card {
          background-color: white;
          padding: 40px;
          border-radius: 20px;
          width: 100%;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          animation: modal-appear 0.3s ease-out;
        }

        @keyframes modal-appear {
          from {
            transform: scale(0.9) translateY(-20px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        .modal-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 20px auto;
          background-color: #d1f4d1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4CAF50;
        }

        .modal-icon svg {
          width: 40px;
          height: 40px;
        }

        .modal-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 10px 0;
        }

        .modal-description {
          color: #6b7280;
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .modal-button {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          background-color: #4CAF50;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .modal-button:hover {
          background-color: #45a049;
        }

        @media (max-width: 768px) { 
          .homepage-title { font-size: 2rem; } 
          .homepage-subtitle { font-size: 1rem; } 
          .widget-card { max-width: 90%; }
          .loading-card { max-width: 90%; padding: 40px 30px; }
        }
      `}</style>
      
      <div className={`page-container ${currentPage === 'home' ? 'visible' : 'hidden'}`}>
        <HomePage onWidgetClick={() => navigateTo('form')} />
      </div>

      <div className={`page-container ${currentPage === 'form' ? 'visible' : 'hidden'}`}>
        <PreOrderPage onBack={() => navigateTo('home')} onSuccess={handleOrderSuccess} />
      </div>

      <SuccessModal isOpen={showSuccessModal} onClose={handleCloseModal} />
    </div>
  );
}

export default App;