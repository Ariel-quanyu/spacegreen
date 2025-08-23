import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Profile helpers
export const createUserProfile = async (userId: string, email: string, username: string, fullName: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert([
      {
        id: userId,
        email,
        username,
        full_name: fullName,
        total_xp: 0,
        events_attended: 0,
        spaces_explored: 0,
        events_created: 0
      }
    ], { 
      onConflict: 'id',
      ignoreDuplicates: false 
    })
    .select()
    .single()
  return { data, error }
}

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  return { data, error }
}

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
  return { data, error }
}

// Activity helpers
export const addUserActivity = async (userId: string, activityType: string, activityName: string, location: string, xpEarned: number) => {
  const { data, error } = await supabase
    .from('user_activities')
    .insert([
      {
        user_id: userId,
        activity_type: activityType,
        activity_name: activityName,
        location,
        xp_earned: xpEarned,
      }
    ])
  return { data, error }
}

export const getUserActivities = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

// Achievement helpers
export const addUserAchievement = async (userId: string, achievementType: string, achievementName: string, description: string, xpReward: number) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .insert([
      {
        user_id: userId,
        achievement_type: achievementType,
        achievement_name: achievementName,
        description,
        xp_reward: xpReward,
      }
    ])
  return { data, error }
}

export const getUserAchievements = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })
  return { data, error }
}