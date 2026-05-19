def generate_recommendation(ai_score, platform):

    if ai_score >= 90:

        return (
            "🔥 Contact immediately — very high lead potential."
        )

    elif ai_score >= 75:

        return (
            "🚀 High engagement probability — follow up soon."
        )

    elif ai_score >= 60:

        return (
            "📈 Moderate potential — keep under monitoring."
        )

    else:

        return (
            "🧊 Low priority lead — monitor only."
        )