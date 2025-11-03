import React, { useState } from 'react';
import qrisImage from '../image/qris.jpeg'; // <-- TAMBAHKAN BARIS INI

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

// --- Komponen Halaman Pre-Order ---
const PreOrderPage = ({ onBack, onSuccess }) => { 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    product: '',
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
        fileName: formData.proof.name,
        mimeType: formData.proof.type,
        fileData: fileData
      };

      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzuDYD1R36gtaQNBjb7z5ahCjFt5roqd-1vhRDNqUrj0o46yaXVYXTo02PoMCAIhBXn/exec";
      fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload)
      })
      .then(res => {
        onSuccess(); 
        e.target.reset();
        setFormData({ name: '', email: '', phone: '', product: '', proof: null });
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
              <option value="Dimsum Colleyah">Dimsum Original - Rp 18.000</option>
              <option value="Dimsum Spesial">Dimsum Mentai - Rp 20.000</option>
              <option value="Produk C - Paket Bundel">Paket Bundel Special Original- Rp 22.000</option>
              <option value="Produk C - Paket Bundel">Paket Bundel Special Mentai- Rp 25.000</option>
            </select>
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
            {isSubmitting ? 'Mengirim...' : 'Kirim Pesanan'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Komponen Baru: Modal Keberhasilan ---
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
        .qris-container { text-align: center; margin: 25px 0; padding: 20px; background-color: #f9fbfd; border-radius: 8px; border: 1px dashed #e0e6ed; }
        .qris-container label { font-weight: 600; color: #2c3e50; display: block; margin-bottom: 15px; text-align: center; }
        .qris-placeholder { display: inline-block; padding: 10px; background-color: white; border-radius: 4px; border: 1px solid #e0e6ed; }
        .qris-placeholder p { margin: 5px 0 0 0; font-weight: bold; font-size: 0.9rem; color: #333; }
        .input-group input[type="file"] { background-color: #f9fbfd; border: 1px solid #e0e6ed; border-radius: 8px; padding: 8px; width: 100%; box-sizing: border-box; color: #6c7a89; font-family: 'Inter', sans-serif; }
        .input-group input[type="file"]::file-selector-button { margin-right: 15px; border: none; background: #3B82F6; padding: 8px 12px; border-radius: 4px; color: #fff; cursor: pointer; transition: background-color .2s ease-in-out; }
        .input-group input[type="file"]::file-selector-button:hover { background: #2563EB; }
        .submit-button { width: 100%; padding: 15px; border: none; border-radius: 8px; background-color: #4CAF50; color: white; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: background-color 0.3s ease, transform 0.1s ease; margin-top: 10px; }
        .submit-button:hover { background-color: #45a049; transform: translateY(-2px); }
        .submit-button:disabled { background-color: #cccccc; cursor: not-allowed; }

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
          transform: scale(0.95);
          opacity: 0;
          animation: modal-appear 0.3s ease-out forwards;
        }
        @keyframes modal-appear {
          to {
            transform: scale(1);
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
        @media (max-width: 768px) { .homepage-title { font-size: 2rem; } .homepage-subtitle { font-size: 1rem; } .widget-card { max-width: 90%; } }
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

