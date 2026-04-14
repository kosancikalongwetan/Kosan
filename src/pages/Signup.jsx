import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Smartphone, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [method, setMethod] = useState('email');
  const [formData, setFormData] = useState({ email: '', phone: '', otp: '' });
  const [verifiedCaptcha, setVerifiedCaptcha] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSocialLogin = async (provider) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
      });
      if (error) throw error;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message,
      });
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!verifiedCaptcha || !agreedToTerms) {
      toast({
        variant: "destructive",
        title: "Persetujuan Diperlukan",
        description: "Harap setujui syarat ketentuan dan konfirmasi captcha.",
      });
      return;
    }

    setLoading(true);
    try {
      // For sign up, we use the same OTP flow but with shouldCreateUser: true (default)
      const { error } = await supabase.auth.signInWithOtp({
        email: method === 'email' ? formData.email : undefined,
        phone: method === 'phone' ? formData.phone : undefined,
      });

      if (error) throw error;

      setOtpSent(true);
      toast({
        title: "Kode OTP Terkirim!",
        description: `Silakan cek ${method === 'email' ? 'email' : 'WhatsApp/SMS'} Anda untuk verifikasi pendaftaran.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal Mendaftar",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: method === 'email' ? formData.email : undefined,
        phone: method === 'phone' ? formData.phone : undefined,
        token: formData.otp,
        type: method === 'email' ? 'magiclink' : 'sms',
      });

      if (error) throw error;

      toast({
        title: "Pendaftaran Berhasil!",
        description: "Akun Anda telah dibuat.",
      });
      navigate('/');
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

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <Link to="/" className="absolute top-6 left-6 text-gray-600 hover:text-black transition-colors flex items-center gap-2">
        <ArrowLeft size={20} /> Kembali
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Buat Akun Baru</h1>
          <p className="mt-2 text-gray-600">Gabung dan temukan hunian impianmu</p>
        </div>

        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full h-12 flex items-center justify-center gap-3 text-base font-normal border-gray-300 hover:bg-gray-50"
            onClick={() => handleSocialLogin('google')}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Daftar dengan Google
          </Button>
          <Button 
            variant="outline" 
            className="w-full h-12 flex items-center justify-center gap-3 text-base font-normal border-gray-300 hover:bg-gray-50"
            onClick={() => handleSocialLogin('apple')}
          >
            <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="w-5 h-5" />
            Daftar dengan Apple
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-xs text-gray-400 uppercase">Atau daftar dengan</span>
          <Separator className="flex-1" />
        </div>

        <Tabs defaultValue="email" className="w-full" onValueChange={(val) => { setMethod(val); setOtpSent(false); }}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Nomor HP</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            {!otpSent ? (
              <form onSubmit={handleSignup} className="space-y-4">
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

                <div className="space-y-3 py-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={agreedToTerms}
                      onCheckedChange={setAgreedToTerms}
                    />
                    <Label htmlFor="terms" className="text-sm font-normal text-gray-600 cursor-pointer leading-tight">
                      Saya menyetujui <a href="#" className="text-black underline">Syarat & Ketentuan</a> serta <a href="#" className="text-black underline">Kebijakan Privasi</a>.
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="captcha-email-signup" 
                      checked={verifiedCaptcha} 
                      onCheckedChange={setVerifiedCaptcha}
                    />
                    <Label htmlFor="captcha-email-signup" className="text-sm font-normal text-gray-600 cursor-pointer">
                      Saya bukan robot (reCAPTCHA)
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 bg-black hover:bg-gray-800 text-white" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Kirim Kode Pendaftaran'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp-email">Kode Verifikasi (OTP)</Label>
                  <Input 
                    id="otp-email" 
                    placeholder="123456" 
                    className="h-11 text-center text-lg tracking-widest"
                    maxLength={6}
                    value={formData.otp}
                    onChange={(e) => setFormData({...formData, otp: e.target.value})}
                    required
                  />
                  <p className="text-sm text-gray-500 text-center">Kode dikirim ke {formData.email}</p>
                </div>
                <Button type="submit" className="w-full h-11 bg-black hover:bg-gray-800 text-white" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Selesaikan Pendaftaran'}
                </Button>
                <button type="button" onClick={() => setOtpSent(false)} className="w-full text-sm text-gray-500 hover:text-black underline">
                  Ganti Email
                </button>
              </form>
            )}
          </TabsContent>

          <TabsContent value="phone">
            {!otpSent ? (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor WhatsApp / HP</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3 text-gray-400" size={18} />
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+62 812 3456 7890" 
                      className="pl-10 h-11"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3 py-2">
                   <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms-phone" 
                      checked={agreedToTerms}
                      onCheckedChange={setAgreedToTerms}
                    />
                    <Label htmlFor="terms-phone" className="text-sm font-normal text-gray-600 cursor-pointer leading-tight">
                      Saya menyetujui <a href="#" className="text-black underline">Syarat & Ketentuan</a> serta <a href="#" className="text-black underline">Kebijakan Privasi</a>.
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="captcha-phone-signup" 
                      checked={verifiedCaptcha} 
                      onCheckedChange={setVerifiedCaptcha}
                    />
                    <Label htmlFor="captcha-phone-signup" className="text-sm font-normal text-gray-600 cursor-pointer">
                      Saya bukan robot (reCAPTCHA)
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 bg-black hover:bg-gray-800 text-white" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Kirim Kode WhatsApp/SMS'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp-phone">Kode Verifikasi (OTP)</Label>
                  <Input 
                    id="otp-phone" 
                    placeholder="123456" 
                    className="h-11 text-center text-lg tracking-widest"
                    maxLength={6}
                    value={formData.otp}
                    onChange={(e) => setFormData({...formData, otp: e.target.value})}
                    required
                  />
                  <p className="text-sm text-gray-500 text-center">Kode dikirim ke {formData.phone}</p>
                </div>
                <Button type="submit" className="w-full h-11 bg-black hover:bg-gray-800 text-white" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Selesaikan Pendaftaran'}
                </Button>
                <button type="button" onClick={() => setOtpSent(false)} className="w-full text-sm text-gray-500 hover:text-black underline">
                  Ganti Nomor
                </button>
              </form>
            )}
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm">
          <span className="text-gray-500">Sudah punya akun? </span>
          <Link to="/login" className="font-semibold text-black hover:underline">
            Masuk Disini
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;