const supabase = require('../config/supabase');

exports.getMetrics = async (req, res) => {
    try {
        if (!supabase) {
            return res.status(200).json({
                status: 'success',
                data: {
                    totalSignups: 42,
                    weeklyGrowth: '+12%',
                    willingToPay: {
                        Yes: 20,
                        Maybe: 15,
                        No: 7
                    },
                    recentSignups: []
                },
                message: '[MOCK DATA] Supabase not configured.'
            });
        }

        // Fetch all signups to compute metrics
        const { data: signups, error } = await supabase
            .from('waitlist')
            .select('*');

        if (error) throw error;

        // Compute Total Signups
        const totalSignups = signups.length;

        // Compute Willing to Pay percentages
        const willingToPay = signups.reduce((acc, curr) => {
            acc[curr.willing_to_pay] = (acc[curr.willing_to_pay] || 0) + 1;
            return acc;
        }, { Yes: 0, Maybe: 0, No: 0 });

        // Calculate basic weekly growth (mock calculation logic for demonstration)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const recentSignups = signups.filter(s => new Date(s.created_at) >= oneWeekAgo).length;
        const olderSignups = totalSignups - recentSignups;

        // Avoid division by zero
        const weeklyGrowthRate = olderSignups > 0
            ? ((recentSignups / olderSignups) * 100).toFixed(1)
            : recentSignups > 0 ? 100 : 0;

        res.status(200).json({
            status: 'success',
            data: {
                totalSignups,
                weeklyGrowth: `+${weeklyGrowthRate}%`,
                willingToPay,
                recentSignups: signups.slice(0, 10) // Top 10 most recent
            }
        });

    } catch (error) {
        console.error('Metrics error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve metrics'
        });
    }
};
