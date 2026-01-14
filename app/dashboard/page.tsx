import { createClient } from "@/lib/supabase/server"
import DashboardClient from "./dashboard-client"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const { data: assessments } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)

  const latestAssessment = assessments?.[0]

  let responsesCount = 0
  let totalScore = 0

  if (latestAssessment?.id) {
    const { count } = await supabase
      .from("assessment_responses")
      .select("*", { count: "exact", head: true })
      .eq("assessment_id", latestAssessment.id)

    responsesCount = count || 0

    const { data: responses } = await supabase
      .from("assessment_responses")
      .select("selected_level")
      .eq("assessment_id", latestAssessment.id)

    totalScore = responses?.reduce((acc, r) => acc + r.selected_level, 0) || 0
  }

  return (
    <DashboardClient
      profile={profile}
      responsesCount={responsesCount}
      totalScore={totalScore}
    />
  )
}
