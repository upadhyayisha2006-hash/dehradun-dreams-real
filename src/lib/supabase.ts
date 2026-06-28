import { createClient } from "@supabase/supabase-js";

// Check if we have Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isMock = !supabaseUrl || !supabaseAnonKey;

// Initialize Supabase client if credentials exist
export const supabase = !isMock ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Auth Session Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface ContactSubmission {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

// Global listeners for auth changes (mock & real)
type AuthListener = (user: UserProfile | null) => void;
const authListeners = new Set<AuthListener>();

function notifyListeners(user: UserProfile | null) {
  authListeners.forEach((listener) => listener(user));
}

// ----------------------------------------------------
// LOCALSTORAGE SIMULATION HELPERS
// ----------------------------------------------------
const LS_KEYS = {
  USERS: "ddr_users",
  SUBMISSIONS: "ddr_submissions",
  SESSION: "ddr_session",
};

interface MockUser {
  id: string;
  name: string;
  email: string;
  password?: string; // stored for mock login verification
  created_at: string;
}

// Helper to seed initial mock users if none exist
function getMockUsers(): MockUser[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LS_KEYS.USERS);
  if (!stored) {
    // Seed default admin and user
    const defaultUsers: MockUser[] = [
      {
        id: "mock-admin-id",
        name: "Doon Owner (Admin)",
        email: "admin@dehradundreams.com",
        password: "adminpassword",
        created_at: new Date().toISOString(),
      },
      {
        id: "mock-user-id",
        name: "Rohan Verma",
        email: "rohan@gmail.com",
        password: "userpassword",
        created_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(LS_KEYS.USERS, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(stored);
}

function getMockSubmissions(): ContactSubmission[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LS_KEYS.SUBMISSIONS);
  if (!stored) {
    const defaultSubmissions: ContactSubmission[] = [
      {
        id: "sub-1",
        name: "Aman Negi",
        email: "amannegi@yahoo.com",
        phone: "+91 9876543210",
        message: "I am interested in buying the 3BHK villa on Rajpur Road. Please contact me with pricing.",
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
      },
      {
        id: "sub-2",
        name: "Pooja Dobhal",
        email: "pooja.d@gmail.com",
        phone: "+91 9988776655",
        message: "Do you have any 2BHK rental apartments available near Mussoorie Road?",
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
      },
    ];
    localStorage.setItem(LS_KEYS.SUBMISSIONS, JSON.stringify(defaultSubmissions));
    return defaultSubmissions;
  }
  return JSON.parse(stored);
}

// Listen to Supabase auth state change if active
if (supabase) {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      // Get profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      const userProfile: UserProfile = {
        id: session.user.id,
        name: profile?.name || session.user.user_metadata?.name || "User",
        email: session.user.email || "",
        created_at: profile?.created_at || session.user.created_at,
      };
      notifyListeners(userProfile);
    } else {
      notifyListeners(null);
    }
  });
}

// ----------------------------------------------------
// DATABASE API ACTIONS
// ----------------------------------------------------

/**
 * Sign up a new user
 */
export async function signUp(name: string, email: string, password: string): Promise<UserProfile> {
  if (isMock) {
    // Local storage simulation
    const users = getMockUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("A user with this email already exists.");
    }

    const newUser: MockUser = {
      id: "mock-user-" + Math.random().toString(36).substr(2, 9),
      name,
      email: email.toLowerCase(),
      password,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(LS_KEYS.USERS, JSON.stringify(users));

    const profile: UserProfile = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      created_at: newUser.created_at,
    };

    localStorage.setItem(LS_KEYS.SESSION, JSON.stringify(profile));
    notifyListeners(profile);
    return profile;
  } else {
    // Supabase SignUp
    const { data, error } = await supabase!.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error("Signup failed. Please try again.");

    // Manually ensure profile is inserted (in case trigger fails or latency occurs)
    const profile: UserProfile = {
      id: data.user.id,
      name,
      email: data.user.email || email,
      created_at: new Date().toISOString(),
    };

    try {
      await supabase!.from("profiles").upsert(profile);
    } catch (e) {
      console.warn("Failed to write profile directly, relying on trigger", e);
    }

    return profile;
  }
}

/**
 * Sign in existing user
 */
export async function signIn(email: string, password: string): Promise<UserProfile> {
  if (isMock) {
    const users = getMockUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const profile: UserProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };

    localStorage.setItem(LS_KEYS.SESSION, JSON.stringify(profile));
    notifyListeners(profile);
    return profile;
  } else {
    const { data, error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error("Login failed.");

    // Fetch details
    const { data: profile } = await supabase!
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    const userProfile: UserProfile = {
      id: data.user.id,
      name: profile?.name || data.user.user_metadata?.name || "User",
      email: data.user.email || email,
      created_at: profile?.created_at || data.user.created_at,
    };

    return userProfile;
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  if (isMock) {
    localStorage.removeItem(LS_KEYS.SESSION);
    notifyListeners(null);
  } else {
    const { error } = await supabase!.auth.signOut();
    if (error) throw error;
  }
}

/**
 * Get current logged in user session (async)
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  if (isMock) {
    if (typeof window === "undefined") return null;
    const sessionStr = localStorage.getItem(LS_KEYS.SESSION);
    if (!sessionStr) return null;
    try {
      return JSON.parse(sessionStr) as UserProfile;
    } catch {
      return null;
    }
  } else {
    const { data: { user } } = await supabase!.auth.getUser();
    if (!user) return null;

    try {
      const { data: profile } = await supabase!
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      return {
        id: user.id,
        name: profile?.name || user.user_metadata?.name || "User",
        email: user.email || "",
        created_at: profile?.created_at || user.created_at,
      };
    } catch {
      return {
        id: user.id,
        name: user.user_metadata?.name || "User",
        email: user.email || "",
        created_at: user.created_at,
      };
    }
  }
}

/**
 * Submit contact form inquiry
 */
export async function submitContact(
  name: string,
  email: string,
  phone: string,
  message: string
): Promise<void> {
  if (isMock) {
    const submissions = getMockSubmissions();
    const newSubmission: ContactSubmission = {
      id: "sub-" + Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      message,
      created_at: new Date().toISOString(),
    };
    submissions.unshift(newSubmission);
    localStorage.setItem(LS_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  } else {
    const { error } = await supabase!.from("contact_submissions").insert([
      { name, email, phone, message },
    ]);
    if (error) throw error;
  }
}

/**
 * Fetch all registered users (for Owner's Dashboard)
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  if (isMock) {
    const mockUsers = getMockUsers();
    return mockUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      created_at: u.created_at,
    }));
  } else {
    const { data, error } = await supabase!
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
}

/**
 * Fetch all contact inquiries (for Owner's Dashboard)
 */
export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  if (isMock) {
    return getMockSubmissions();
  } else {
    const { data, error } = await supabase!
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
}

/**
 * Subscribe to auth state updates
 */
export function subscribeToAuth(listener: AuthListener) {
  authListeners.add(listener);
  // Get initial value
  getCurrentUser().then((user) => {
    // Only fire if listener is still subscribed
    if (authListeners.has(listener)) {
      listener(user);
    }
  });

  return () => {
    authListeners.delete(listener);
  };
}
