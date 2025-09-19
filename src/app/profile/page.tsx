"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Edit2, Save, Upload, MapPin, Briefcase, Calendar, Globe, Lock, Eye, EyeOff } from "lucide-react";
import { showSuccessAlert, showErrorAlert, showWarningAlert } from "@/components/Utils/alert-util";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const UserOverview = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    profilePicture: "",
    title: "",
    location: "",
    department: "",
    joinDate: "",
    bio: "",
    skills: [],
    website: "",
    provider: "local",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the URL contains a token from a social login redirect
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    // If a token is found in the URL, save it to localStorage and clean the URL
    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      router.replace("/profile");
    }

    const fetchProfile = async () => {
      // Get the token from local storage (either a newly saved one or an existing one)
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await res.json();
        setUserData({
          ...userData,
          name: data.name || "N/A",
          email: data.email || "N/A",
          phone: data.phone || "N/A",
          profilePicture: data.profilePicture || "/profile-pic.jpg",
          provider: data.provider || "local",
        });
      } catch (error) {
        console.error("Authentication failed:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };
    fetchProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = () => {
    console.log("User Data Saved:", userData);
    setIsEditing(false);
    showSuccessAlert("Changes saved successfully!");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserData({ ...userData, profilePicture: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your personal and professional information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-md border-0 rounded-xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-5">
                    <div className="w-36 h-36 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 p-1">
                      <img
                        src={userData.profilePicture || "/profile-pic.jpg"}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-4 border-white"
                      />
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-2 right-2 bg-emerald-600 p-2 rounded-full cursor-pointer shadow-md hover:bg-emerald-700 transition-colors">
                        <Upload className="h-4 w-4 text-white" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800 text-center">{userData.name}</h2>
                  <p className="text-gray-600 mt-1 text-center">{userData.title}</p>
                  <div className="flex items-center mt-2 text-gray-500">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="text-sm truncate">{userData.location}</span>
                  </div>

                  <div className="mt-6 w-full">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                      <span className="text-sm font-medium text-emerald-600">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 rounded-xl overflow-hidden">
              <CardContent className="p-6">
                <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-emerald-600" />
                  Work Stats
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Projects</span>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 px-2 py-1 font-medium">
                      42
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Connections</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 px-2 py-1 font-medium">
                      18
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Years Experience</span>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 px-2 py-1 font-medium">
                      5+
                    </Badge>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
                    <span>Joined {userData.joinDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-md border-0 rounded-xl overflow-hidden">
              <CardHeader className="border-b border-gray-200 bg-gray-50 py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <CardTitle className="text-xl font-semibold text-gray-800">Profile Information</CardTitle>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button onClick={() => setIsEditing(false)} variant="outline" className="border-gray-300">
                        Cancel
                      </Button>
                      <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 shadow-sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleEdit} variant="outline" className="border-gray-300">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full justify-start border-b border-gray-200 rounded-none px-6 bg-white">
                    <TabsTrigger
                      value="profile"
                      className="py-4 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 rounded-none"
                    >
                      Personal Info
                    </TabsTrigger>
                    <TabsTrigger
                      value="professional"
                      className="py-4 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 rounded-none"
                    >
                      Professional
                    </TabsTrigger>
                    {userData.provider === "local" && (
                      <TabsTrigger
                        value="security"
                        className="py-4 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 rounded-none"
                      >
                        Security
                      </TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="profile" className="p-6 m-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <Input
                          type="text"
                          name="name"
                          value={userData.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border-gray-300 focus:border-emerald-400 disabled:bg-gray-100 disabled:text-gray-600"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <Input
                          type="email"
                          name="email"
                          value={userData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border-gray-300 focus:border-emerald-400 disabled:bg-gray-100 disabled:text-gray-600"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <Input
                          type="text"
                          name="phone"
                          value={userData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border-gray-300 focus:border-emerald-400 disabled:bg-gray-100 disabled:text-gray-600"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Website</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="text"
                            name="website"
                            value={userData.website}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full border-gray-300 pl-10 focus:border-emerald-400 disabled:bg-gray-100 disabled:text-gray-600"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Bio</label>
                        <textarea
                          name="bio"
                          value={userData.bio}
                          onChange={handleChange}
                          disabled={!isEditing}
                          rows={4}
                          className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 disabled:bg-gray-100 disabled:text-gray-600"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="professional" className="p-6 m-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Job Title</label>
                        <Input
                          type="text"
                          name="title"
                          value={userData.title}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border-gray-300 focus:border-emerald-400 disabled:bg-gray-100 disabled:text-gray-600"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Department</label>
                        <Input
                          type="text"
                          name="department"
                          value={userData.department}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border-gray-300 focus:border-emerald-400 disabled:bg-gray-100 disabled:text-gray-600"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <Input
                          type="text"
                          name="location"
                          value={userData.location}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border-gray-300 focus:border-emerald-400 disabled:bg-gray-100 disabled:text-gray-600"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Join Date</label>
                        <Input
                          type="text"
                          name="joinDate"
                          value={userData.joinDate}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border-gray-300 focus:border-emerald-400 disabled:bg-gray-100 disabled:text-gray-600"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Skills</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {userData.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-3 py-1"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {isEditing && (
                            <Badge
                              variant="outline"
                              className="cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 border-gray-300"
                            >
                              + Add Skill
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="p-6 m-0">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                          <Lock className="h-5 w-5 mr-2 text-emerald-600" />
                          Change Password
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Current Password</label>
                            <div className="relative">
                              <Input
                                type={showCurrentPassword ? "text" : "password"}
                                disabled={!isEditing}
                                className="w-full border-gray-300 focus:border-emerald-400 disabled:bg-gray-100 disabled:text-gray-600 pr-10"
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          <div></div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">New Password</label>
                            <div className="relative">
                              <Input
                                type={showNewPassword ? "text" : "password"}
                                disabled={!isEditing}
                                className="w-full border-gray-300 focus:border-emerald-400 disabled:bg-gray-100 disabled:text-gray-600 pr-10"
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                disabled={!isEditing}
                                className="w-full border-gray-300 focus:border-emerald-400 disabled:bg-gray-100 disabled:text-gray-600 pr-10"
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Two-Factor Authentication</h3>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <p className="text-gray-600 text-sm sm:text-base">
                            Protect your account with an extra layer of security. Once configured, you'll be required to
                            enter both your password and an authentication code from your mobile phone in order to sign
                            in.
                          </p>
                          <Button variant="outline" disabled={!isEditing} className="border-gray-300 whitespace-nowrap">
                            Enable 2FA
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;