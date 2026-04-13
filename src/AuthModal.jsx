import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Loader2, Lock, Eye, EyeOff, User, Phone, ChevronDown, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const AuthModal = ({ isOpen, onClose, initialView = 'login' }) => {
  const { toast } = useToast();
  const [view, setView] = useState(initialView); // 'login' | 'signup'
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [loading, setLoading] = useState(false);
  
  // Form Data
  const [formData, setFormData] = useState({ 
    firstName: '',
    lastName: '',
    phone: '',
    email: '', 
    password: '', 
    confirmPassword: '',
    otpCode: ''
  });
  
  // Validation States
  const [verifiedCaptcha, setVerifiedCaptcha] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setStep('form');
      setFormData({ 
        firstName: '', lastName: '', phone: '', email: '', 
        password: '', confirmPassword: '', otpCode: '' 
      });
      setVerifiedCaptcha(false);
      setAgreedToTerms(false);
      setPhoneVerified(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, initialView]);

  const handleSocialLogin = async (provider) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: error.message,
      });
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!formData.phone || formData.phone.length < 8) {
      toast({
        variant: "destructive",
        title: "Nomor Tidak Valid",
        description: "Mohon masukkan nomor ponsel yang benar.",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+62${formData.phone.replace(/^0+/, '')}`,
      });

      if (error) throw error;

      setStep('otp');
      toast({
        title: "OTP Terkirim",
        description: "Kode verifikasi telah dikirim ke WhatsApp/SMS Anda.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal Mengirim OTP",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (formData.otpCode.length < 6) {
      toast({
        variant: "destructive",
        description: "Kode OTP harus 6 digit.",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: `+62${formData.phone.replace(/^0+/, '')}`,
        token: formData.otpCode,
        type: 'sms',
      });

      if (error) throw error;

      setPhoneVerified(true);
      setStep('form');
      toast({
        title: "Nomor Terverifikasi",
        description: "Silakan lanjutkan pengisian data.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verifikasi Gagal",
        description: "Kode OTP salah atau kedaluwarsa.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!verifiedCaptcha) return toast({ variant: "destructive", description: "Mohon konfirmasi captcha." });

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;

      toast({ title: "Login Berhasil!", description: "Selamat datang kembali." });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal Masuk",
        description: "Email atau password salah.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!verifiedCaptcha) return toast({ variant: "destructive", description: "Mohon konfirmasi captcha." });
    if (!agreedToTerms) return toast({ variant: "destructive", description: "Harap setujui syarat ketentuan." });
    if (!phoneVerified) return toast({ variant: "destructive", title: "Verifikasi Ponsel Diperlukan", description: "Silakan verifikasi nomor ponsel Anda terlebih dahulu." });
    
    if (formData.password !== formData.confirmPassword) {
      return toast({ variant: "destructive", description: "Password tidak cocok." });
    }

    setLoading(true);
    try {
      // User is already logged in via OTP at this point
      // We update the user with email, password, and metadata
      const { error } = await supabase.auth.updateUser({
        email: formData.email,
        password: formData.password,
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phone // store formatted or raw
        }
      });

      if (error) throw error;

      toast({
        title: "Pendaftaran Berhasil!",
        description: "Akun Anda telah dibuat.",
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal Daftar",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[20px] max-h-[90vh] overflow-y-auto w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 md:rounded-[20px] md:bottom-4 shadow-xl custom-scrollbar"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-20 px-6 pt-4 pb-2 rounded-t-[20px]">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="flex justify-between items-center mb-2">
                {step === 'otp' ? (
                   <button onClick={() => setStep('form')} className="flex items-center gap-2 text-sm font-medium hover:text-gray-600">
                     <ArrowLeft size={18} /> Kembali
                   </button>
                ) : (
                  <h2 className="text-xl font-bold">
                    {view === 'login' ? 'Selamat Datang' : 'Buat Akun Baru'}
                  </h2>
                )}
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="px-6 pb-8">
              {step === 'otp' ? (
                // OTP Verification Screen
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 pt-4"
                >
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold">Verifikasi Nomor Ponsel</h3>
                    <p className="text-sm text-gray-500">
                      Masukkan 6 digit kode yang kami kirim ke <br />
                      <span className="font-medium text-black">+62 {formData.phone}</span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Input 
                      className="text-center text-2xl tracking-[0.5em] h-14 font-mono"
                      maxLength={6}
                      placeholder="000000"
                      value={formData.otpCode}
                      onChange={(e) => setFormData({...formData, otpCode: e.target.value.replace(/\D/g, '')})}
                      autoFocus
                    />
                    
                    <Button 
                      className="w-full h-12 bg-black text-white hover:bg-gray-800"
                      onClick={handleVerifyOtp}
                      disabled={loading || formData.otpCode.length < 6}
                    >
                      {loading ? <Loader2 className="animate-spin" /> : "Verifikasi"}
                    </Button>
                  </div>

                  <div className="text-center">
                    <button 
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="text-sm text-gray-500 hover:text-black underline"
                    >
                      Kirim ulang kode
                    </button>
                  </div>
                </motion.div>
              ) : (
                // Main Form
                <div className="space-y-6">
                  {/* Social Buttons */}
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full h-12 flex items-center justify-center gap-3 font-normal border-gray-300 hover:bg-gray-50 rounded-lg"
                      onClick={() => handleSocialLogin('google')}
                    >
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                      {view === 'login' ? 'Masuk' : 'Daftar'} dengan Google
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full h-12 flex items-center justify-center gap-3 font-normal border-gray-300 hover:bg-gray-50 rounded-lg"
                      onClick={() => handleSocialLogin('apple')}
                    >
                      <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="w-5 h-5" />
                      {view === 'login' ? 'Masuk' : 'Daftar'} dengan Apple
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                      <span className="bg-white px-2 text-gray-400">ATAU</span>
                    </div>
                  </div>

                  <form onSubmit={view === 'login' ? handleLogin : handleSignup} className="space-y-4">
                    
                    {view === 'signup' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">Nama Depan</Label>
                            <Input 
                              id="firstName"
                              placeholder="Jhon" 
                              className="h-11"
                              value={formData.firstName}
                              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Nama Belakang</Label>
                            <Input 
                              id="lastName"
                              placeholder="Doe" 
                              className="h-11"
                              value={formData.lastName}
                              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Nomor Ponsel</Label>
                          <div className="flex gap-3">
                            <div className="flex items-center gap-1 border rounded-md px-3 bg-gray-50 shrink-0 h-11 border-input">
                              <img 
                                src="https://flagcdn.com/w40/id.png" 
                                srcSet="https://flagcdn.com/w80/id.png 2x" 
                                width="24" 
                                alt="Indonesia" 
                                className="rounded-sm"
                              />
                              <span className="text-sm font-medium ml-1">+62</span>
                              <ChevronDown size={14} className="text-gray-500 ml-1" />
                            </div>
                            <div className="relative w-full">
                              <Input 
                                id="phone"
                                type="tel"
                                placeholder="812 3456 7890" 
                                className={`pl-4 h-11 ${phoneVerified ? 'border-green-500 bg-green-50' : ''}`}
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                                readOnly={phoneVerified}
                                required
                              />
                              {phoneVerified && (
                                <CheckCircle2 className="absolute right-3 top-3 text-green-600" size={20} />
                              )}
                            </div>
                          </div>
                          {!phoneVerified && (
                            <button 
                              type="button"
                              onClick={handleSendOtp}
                              className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-black mt-1"
                            >
                              <Phone size={12} /> Kirim Kode OTP
                            </button>
                          )}
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Alamat Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="nama@email.com" 
                          className="pl-10 h-11"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="pl-10 pr-10 h-11"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {view === 'signup' && (
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                          <Input 
                            id="confirmPassword" 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            className="pl-10 pr-10 h-11"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-3 pt-1">
                      {view === 'signup' && (
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="terms" 
                            checked={agreedToTerms}
                            onCheckedChange={setAgreedToTerms}
                          />
                          <Label htmlFor="terms" className="text-xs font-normal text-gray-600 cursor-pointer leading-tight pt-0.5">
                            Setuju dengan <span className="underline">S&K</span> dan <span className="underline">Kebijakan Privasi</span>.
                          </Label>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="captcha-auth" 
                          checked={verifiedCaptcha} 
                          onCheckedChange={setVerifiedCaptcha}
                        />
                        <Label htmlFor="captcha-auth" className="text-xs font-normal text-gray-600 cursor-pointer">
                          Saya bukan robot (reCAPTCHA)
                        </Label>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-11 bg-black hover:bg-gray-800 text-white rounded-lg mt-2" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (view === 'login' ? 'Masuk' : 'Daftar')}
                    </Button>
                  </form>

                  <div className="text-center text-sm pb-2">
                    <span className="text-gray-500">
                      {view === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                    </span>
                    <button 
                      onClick={() => setView(view === 'login' ? 'signup' : 'login')} 
                      className="font-semibold text-black hover:underline"
                    >
                      {view === 'login' ? 'Daftar Sekarang' : 'Masuk Disini'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;