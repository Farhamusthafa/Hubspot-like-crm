"use client";

import { useState, useEffect, useRef } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { Typography } from "@mui/material";
import GlobalSearch from "./GlobalSearch";
import { NotificationService, Notification } from "@/components/services/notificationService";
import { useRouter } from "next/navigation";
import { Bell, ChevronLeft, ChevronRight, X, Camera, Eye, EyeOff } from "lucide-react";
import { useSnackbar } from "notistack"; // Changed to Notistack
import { getProfile, updateProfile, changePassword, uploadProfilePhoto } from "@/lib/api";
import { API } from "@/lib/api";

export default function Topbar() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar(); // Notistack Hook


  // NEW: State to track which view we are in
  const [activePanel, setActivePanel] = useState<'none' | 'notifications' | 'profile' | 'editProfile' | 'settings' | 'changePassword'>('none');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic User State
  const [userProfile, setUserProfile] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
    phone: "",
    gender: "",
    companyName: "",
    industryType: "",
    countryRegion: "",
    profileImage: null as string | null
  });

  const [loading, setLoading] = useState(true);

  // Helper to get full image URL
  const getProfileImageUrl = (filename?: string | null): string | undefined => {
    if (!filename) return undefined;
    if (filename.startsWith("http")) return filename;
    // Try profile directory first (new uploads), then images directory (existing uploads)
    const profileUrl = `${API}/uploads/profile/${filename}`;
    const imageUrl = `${API}/uploads/images/${filename}`;
    console.log('getProfileImageUrl called with:', filename, 'trying profile:', profileUrl, 'fallback:', imageUrl);
    return profileUrl; // Try profile first
  };

  // Image component with fallback
  const ProfileImage = ({ filename, className }: { filename?: string | null; className?: string }) => {
    const [imgSrc, setImgSrc] = useState<string | undefined>(() => getProfileImageUrl(filename));
    const [errorCount, setErrorCount] = useState(0);

    const handleError = () => {
      if (errorCount === 0 && filename) {
        // Try the images directory as fallback
        const fallbackUrl = `${API}/uploads/images/${filename}`;
        console.log('Profile image failed, trying fallback:', fallbackUrl);
        setImgSrc(fallbackUrl);
        setErrorCount(1);
      } else {
        console.log('Both profile image attempts failed');
        setImgSrc(undefined);
      }
    };

    if (!imgSrc) return null;

    return (
      <img
        src={imgSrc}
        alt="Profile"
        className={className}
        onError={handleError}
      />
    );
  };

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        // Backend returns profile data directly, not wrapped in user object
        setUserProfile({
          id: data.id,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          role: data.role || "user",
          phone: data.phone || "",
          gender: data.gender || "",
          companyName: data.companyName || "",
          industryType: data.industryType || "",
          countryRegion: data.countryRegion || "",
          profileImage: data.profileImage || null
        });
        setProfileImage(data.profileImage || null);
        console.log('Profile image from backend:', data.profileImage);
        console.log('Profile image URL:', getProfileImageUrl(data.profileImage));
      } catch (error: any) {
        console.error('Failed to fetch profile:', error);

        // Handle authentication errors
        if (error.message.includes('Session expired') || error.message.includes('No authentication token') || error.message.includes('User not found')) {
          // Clear localStorage and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }

        // Try to get user data from localStorage as fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUserProfile({
              id: userData.id,
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              email: userData.email || "",
              role: userData.role || "user",
              phone: userData.phone || "",
              gender: userData.gender || "",
              companyName: userData.companyName || "",
              industryType: userData.industryType || "",
              countryRegion: userData.countryRegion || "",
              profileImage: userData.profileImage || null
            });
          } catch (parseError) {
            console.error('Failed to parse stored user data:', parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Temporary state for editing
  const [editedProfile, setEditedProfile] = useState(userProfile);

  // Update editedProfile when userProfile changes
  useEffect(() => {
    setEditedProfile(userProfile);
  }, [userProfile]);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await NotificationService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    await NotificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleClearAll = async () => {
    await NotificationService.clearAll();
    setNotifications([]);
    setUnreadCount(0);
  };

  const closeAll = () => {
    setActivePanel('none');
    setPasswords({ current: "", new: "", confirm: "" }); // Reset passwords on close
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    enqueueSnackbar("Signing out...", { variant: 'info' });
    router.push('/login');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const data = await uploadProfilePhoto(file);
        // Backend returns { message: "...", user: {...} }
        if (data.user) {
          setProfileImage(data.user.profileImage);
          setUserProfile(prev => ({ ...prev, profileImage: data.user.profileImage }));
        }
        enqueueSnackbar("Profile photo updated!", { variant: 'success' });
      } catch (error: any) {
        enqueueSnackbar(error.message || "Failed to upload photo", { variant: 'error' });
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      const profileData = {
        firstName: editedProfile.firstName,
        lastName: editedProfile.lastName,
        phone: editedProfile.phone,
        companyName: editedProfile.companyName,
        industryType: editedProfile.industryType,
        countryRegion: editedProfile.countryRegion,
        gender: editedProfile.gender
      };

      const data = await updateProfile(profileData);
      // Backend returns updated profile directly, not wrapped in user object
      setUserProfile(data);
      enqueueSnackbar("Profile updated successfully!", { variant: 'success' });
      setActivePanel('profile');
    } catch (error: any) {
      enqueueSnackbar(error.message || "Failed to update profile", { variant: 'error' });
    }
  };

  // Get first letter for avatar
  const avatarLetter = (userProfile?.firstName || userProfile?.email || 'U').charAt(0).toUpperCase();

  // Show loading state while profile is loading
  if (loading) {
    return (
      <header className="w-full h-16 flex items-center justify-between px-8 bg-white">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight shrink-0">CRM</h1>
        <div className="flex-1" />
        <div className="flex items-center gap-6 shrink-0">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      </header>
    );
  }

  // Helper to get titles for the panel
  const getPanelTitle = () => {
    switch (activePanel) {
      case 'notifications': return "Notifications";
      case 'profile': return "Account";
      case 'editProfile': return "Edit Profile";
      case 'settings': return "Settings";
      case 'changePassword': return "Change Password";
      default: return "";
    }
  };


  return (
    <>
      <header className="w-full h-16 flex items-center justify-between px-8 bg-white">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight shrink-0">CRM</h1>
        <div className="flex-1" />
        <div className="flex items-center gap-6">
          <GlobalSearch />
          <div className="flex items-center gap-6 shrink-0">
            <button
              className={`relative w-10 h-10 flex items-center justify-center rounded-xl border border-[#E2E8F0] transition-all ${activePanel === 'notifications' ? 'bg-indigo-50 border-[#5948DB]' : 'bg-white hover:bg-slate-50'}`}
              onClick={() => setActivePanel('notifications')}
            >
              <Bell size={20} className={activePanel === 'notifications' ? 'text-[#5948DB]' : 'text-slate-500'} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all border-2 ${activePanel === 'profile' ? 'border-[#5948DB] scale-105' : 'border-white'} bg-[#5948DB] text-white shadow-sm overflow-hidden`}
              onClick={() => setActivePanel('profile')}
            >
              {profileImage ? (
                <ProfileImage filename={profileImage} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[15px] font-bold">{avatarLetter}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {activePanel !== 'none' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={closeAll} />
      )}

      {/* --- SLIDE PANEL (Unified) --- */}
      {activePanel !== 'none' && (
        <SlidePanel
          title={getPanelTitle()}
          onClose={closeAll}
          onBack={['editProfile', 'settings', 'changePassword'].includes(activePanel) ? () => setActivePanel('profile') : undefined}
        >
          {/* 1. NOTIFICATIONS VIEW */}
          {activePanel === 'notifications' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className={`p-5 border-b border-gray-50 hover:bg-gray-50 transition-colors relative group ${!n.read ? 'bg-indigo-50/20' : ''}`}>
                      <div className="flex gap-4">
                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!n.read ? 'bg-[#5948DB]' : 'bg-transparent'}`} />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-[13px] font-bold text-gray-900">{n.title}</h4>
                            {/* <span className="text-[11px] text-gray-400 font-medium">{n.time}</span> */}
                          </div>
                          <p className="text-[12px] text-gray-500 leading-relaxed">{n.message}</p>
                          {!n.read && (
                            <button onClick={() => handleMarkAsRead(n.id)} className="mt-2 text-[11px] font-bold text-[#5948DB] hover:underline">
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Bell size={40} className="mb-3 opacity-20" />
                    <p className="text-sm">No new notifications</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t bg-gray-50 flex gap-3">
                <button onClick={closeAll} className="flex-1 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600">Close</button>
                <button onClick={handleClearAll} className="flex-1 py-2.5 bg-[#5948DB] text-white rounded-xl text-sm font-bold">Clear All</button>
              </div>
            </div>
          )}

          {/* 2. PROFILE MAIN VIEW */}
          {activePanel === 'profile' && (
            <div className="flex flex-col h-full">
              <div className="p-8 bg-gradient-to-b from-[#5948DB]/5 to-white flex flex-col items-center text-center">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#5948DB] text-white shadow-xl mb-4 border-4 border-white overflow-hidden">
                  {profileImage ? (
                    <ProfileImage filename={profileImage} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold">{avatarLetter}</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{userProfile?.firstName && userProfile?.lastName ? `${userProfile.firstName} ${userProfile.lastName}` : userProfile?.email || 'Loading...'}</h3>
                <p className="text-sm text-gray-500">{userProfile?.email || 'Loading...'}</p>
                <div className="mt-4 px-4 py-1.5 bg-indigo-50 text-[#5948DB] text-[11px] font-bold uppercase tracking-wider rounded-full border border-indigo-100/50">
                  {userProfile.role}
                </div>
              </div>
              <div className="py-2">
                <ProfileItem icon="👤" label="Edit Profile" description="Change your basic details" onClick={() => { setEditedProfile(userProfile); setActivePanel('editProfile'); }} />
                <ProfileItem icon="⚙️" label="Account Settings" description="Privacy and security" onClick={() => setActivePanel('settings')} />
                <ProfileItem icon="🔑" label="Change Password" description="Update your credentials" onClick={() => setActivePanel('changePassword')} />
              </div>
              <div className="p-6 mt-auto bg-gray-50">
                <button
                  onClick={handleSignOut}
                  className="w-full py-4 rounded-xl bg-[#5948DB] text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-indigo-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}

          {/* 3. EDIT PROFILE VIEW */}
          {activePanel === 'editProfile' && (
            <div className="p-6 flex flex-col gap-6">
              <div className="flex flex-col items-center mb-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-full bg-indigo-50 flex flex-col items-center justify-center border-2 border-dashed border-[#5948DB]/30 text-[#5948DB] text-[10px] text-center cursor-pointer hover:bg-indigo-100 transition-all overflow-hidden relative group"
                >
                  {profileImage ? (
                    <>
                      <ProfileImage filename={profileImage} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={16} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Camera size={24} className="text-[#5948DB]" />
                      <span className="text-[#5948DB] text-[10px] font-medium mt-1">Upload Photo</span>
                    </>
                  )}
                </div>
              </div>
              <EditField label="First Name" value={editedProfile.firstName} onChange={(val: string) => setEditedProfile({ ...editedProfile, firstName: val })} />
              <EditField label="Last Name" value={editedProfile.lastName} onChange={(val: string) => setEditedProfile({ ...editedProfile, lastName: val })} />
              <EditField label="Contact Email" value={editedProfile.email} onChange={(val: string) => setEditedProfile({ ...editedProfile, email: val })} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">Gender</label>
                <select
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-[#5948DB] transition-all"
                  value={editedProfile.gender}
                  onChange={(e) => setEditedProfile({ ...editedProfile, gender: e.target.value })}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Preferred not to say</option>
                </select>
              </div>
              <EditField label="Phone Number" value={editedProfile.phone} onChange={(val: string) => setEditedProfile({ ...editedProfile, phone: val })} />
              <EditField label="Company Name" value={editedProfile.companyName} onChange={(val: string) => setEditedProfile({ ...editedProfile, companyName: val })} />
              <EditField label="Industry Type" value={editedProfile.industryType} onChange={(val: string) => setEditedProfile({ ...editedProfile, industryType: val })} />
              <EditField label="Country/Region" value={editedProfile.countryRegion} onChange={(val: string) => setEditedProfile({ ...editedProfile, countryRegion: val })} />
              <button
                onClick={handleSaveProfile}
                className="w-full py-4 mt-4 rounded-xl bg-[#5948DB] text-white font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-all text-sm"
              >
                Save Profile Changes
              </button>
            </div>
          )}

          {/* 4. SETTINGS VIEW */}
          {activePanel === 'settings' && (
            <div className="p-6 flex flex-col gap-6">
              <Typography sx={{ fontSize: '14px', color: '#667085', mb: 1 }}>
                Manage your system preferences and account privacy.
              </Typography>
              <div className="space-y-4">
                <SettingToggle label="Email Notifications" description="Get updates on your email" defaultChecked />
                <SettingToggle label="Two-Factor Auth" description="Extra layer of security" />
                <SettingToggle label="Public Profile" description="Make your profile visible to others" />
              </div>
              <button
                onClick={() => setActivePanel('profile')}
                className="w-full py-4 mt-4 rounded-xl bg-[#5948DB] text-white font-bold active:scale-95 transition-all text-sm"
              >
                Apply Settings
              </button>
            </div>
          )}

          {/* 5. CHANGE PASSWORD VIEW */}
          {activePanel === 'changePassword' && (
            <div className="p-6 flex flex-col gap-6">
              <Typography sx={{ fontSize: '14px', color: '#667085', mb: 1 }}>
                Choose a strong password with at least 8 characters.
              </Typography>
              <EditField
                label="Current Password"
                value={passwords.current}
                type="password"
                onChange={(val: string) => setPasswords({ ...passwords, current: val })}
              />
              <EditField
                label="New Password"
                value={passwords.new}
                type="password"
                onChange={(val: string) => setPasswords({ ...passwords, new: val })}
              />
              <EditField
                label="Confirm New Password"
                value={passwords.confirm}
                type="password"
                onChange={(val: string) => setPasswords({ ...passwords, confirm: val })}
              />
              <button
                onClick={async () => {
                  if (!passwords.current || !passwords.new || !passwords.confirm) {
                    enqueueSnackbar("Please fill all fields", { variant: 'error' });
                    return;
                  }
                  if (passwords.new !== passwords.confirm) {
                    enqueueSnackbar("Passwords do not match", { variant: 'error' });
                    return;
                  }
                  try {
                    enqueueSnackbar("Updating password...", { variant: 'info' });
                    await changePassword({
                      currentPassword: passwords.current,
                      newPassword: passwords.new
                    });
                    enqueueSnackbar("Password updated successfully!", { variant: 'success' });
                    setPasswords({ current: "", new: "", confirm: "" });
                    setActivePanel('profile');
                  } catch (error: any) {
                    enqueueSnackbar(error.message || "Failed to update password", { variant: 'error' });
                  }
                }}
                className="w-full py-4 mt-2 rounded-xl bg-[#5948DB] text-white font-bold active:scale-95 transition-all text-sm shadow-lg shadow-indigo-100"
              >
                Update Password
              </button>
            </div>
          )}
        </SlidePanel>
      )}
    </>
  );
}

function EditField({ label, value, onChange, type = "text" }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5 overflow-hidden">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <div className="relative">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-slate-600 focus:border-[#5948DB] focus:ring-4 focus:ring-[#5948DB]/10 outline-none transition-all pr-11"
          placeholder={`Enter ${label}...`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

function SettingToggle({ label, description, defaultChecked }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
      <div>
        <p className="text-sm font-bold text-gray-900">{label}</p>
        <p className="text-[11px] text-gray-500">{description}</p>
      </div>
      <input type="checkbox" defaultChecked={defaultChecked} className="w-5 h-5 accent-[#5948DB] cursor-pointer" />
    </div>
  );
}

function SlidePanel({ title, onClose, onBack, children }: any) {
  return (
    <div className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col transition-all duration-300 animate-in slide-in-from-right">
      <div className="flex items-center p-6 bg-white shrink-0">
        {onBack && (
          <button onClick={onBack} className="mr-3 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
        )}
        <h2 className="text-lg font-bold flex-1 text-slate-900">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:bg-gray-50 p-2 rounded-xl transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">{children}</div>
    </div>
  );
}

function ProfileItem({ icon, label, description, onClick }: any) {
  return (
    <div className="px-5 py-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4 transition-colors group" onClick={onClick}>
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-xl group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-bold text-gray-900 group-hover:text-[#5948DB] transition-colors">{label}</p>
        {description && <p className="text-[12px] text-gray-500">{description}</p>}
      </div>
      <ChevronRight size={16} className="text-gray-300 group-hover:text-[#5948DB] transition-colors" />
    </div>
  );
}
