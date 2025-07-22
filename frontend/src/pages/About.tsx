// src/pages/About.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// --- 1. CHANGED: Import the single, correct function from apiService ---
import { fetchAboutPageData } from '../utils/apiService';
import { Heart, Shield, Users, Globe, Loader } from 'lucide-react';

// --- 2. Define the data structures for TypeScript ---
interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}
interface Value {
  _id: string;
  icon: string; // This will be a string like 'heart', 'shield', etc.
  title: string;
  description: string;
}

// Helper function to render an icon based on its name string
const ValueIcon = ({ iconName }: { iconName: string }) => {
    switch (iconName) {
        case 'heart': return <Heart className="h-8 w-8 text-red-500" />;
        case 'shield': return <Shield className="h-8 w-8 text-blue-500" />;
        case 'users': return <Users className="h-8 w-8 text-green-500" />;
        case 'globe': return <Globe className="h-8 w-8 text-purple-500" />;
        default: return null;
    }
};

export function About() {
    // --- 3. Set up state for your data ---
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [values, setValues] = useState<Value[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- 4. Use useEffect to fetch data on component load ---
    useEffect(() => {
        const loadData = async () => {
            try {
                // The API now returns an object like { teamMembers: [...], values: [...] }
                const { teamMembers, values } = await fetchAboutPageData();
                setTeamMembers(teamMembers);
                setValues(values);
            } catch (err: any) {
                setError('Failed to load page data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen"><Loader className="animate-spin" size={48} /></div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-white">
            {/* Our Story Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4">About Hindu Seva Kendra</h1>
                    <p className="text-lg text-gray-600">
                        A community-driven platform dedicated to connecting individuals with trusted service providers, rooted in the values of seva (selfless service) and dharma.
                    </p>
                </div>
            </div>

            {/* Our Values Section */}
            <div className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value) => (
                            <div key={value._id} className="text-center p-6">
                                <div className="flex justify-center mb-4">
                                    <ValueIcon iconName={value.icon} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Our Team Section */}
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member) => (
                            <div key={member._id} className="bg-white rounded-lg shadow-sm text-center p-6">
                                <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                                <h3 className="text-lg font-semibold">{member.name}</h3>
                                <p className="text-blue-600">{member.role}</p>
                                <p className="text-gray-500 mt-2 text-sm">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}