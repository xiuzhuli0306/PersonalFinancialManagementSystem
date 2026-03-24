<template>
    <div class="admin-statistics">
        <!-- Period Selector -->
        <el-card class="period-card">
            <div class="period-bar">
                <div class="period-tabs">
                    <span class="period-tab" :class="{ active: period === 'month' }"
                        @click="switchPeriod('month')">Monthly</span>
                    <span class="period-tab" :class="{ active: period === 'quarter' }"
                        @click="switchPeriod('quarter')">Quarterly</span>
                    <span class="period-tab" :class="{ active: period === 'year' }"
                        @click="switchPeriod('year')">Yearly</span>
                </div>
                <div class="period-selectors">
                    <el-select v-model="selectedYear" style="width: 100px" @change="loadAll">
                        <el-option v-for="y in yearOptions" :key="y" :label="y" :value="y" />
                    </el-select>
                    <el-select v-if="period === 'month'" v-model="selectedMonth" style="width: 90px" @change="loadAll">
                        <el-option v-for="m in 12" :key="m" :label="m + ' Month'" :value="m" />
                    </el-select>
                    <el-select v-if="period === 'quarter'" v-model="selectedQuarter" style="width: 90px"
                        @change="loadAll">
                        <el-option label="Q1" :value="1" />
                        <el-option label="Q2" :value="2" />
                        <el-option label="Q3" :value="3" />
                        <el-option label="Q4" :value="4" />
                    </el-select>
                </div>
            </div>
        </el-card>

        <!-- Overview Cards -->
        <div class="stat-cards">
            <div class="stat-card income">
                <div class="stat-icon">📈</div>
                <div class="stat-info">
                    <div class="stat-label">Total Income</div>
                    <div class="stat-value">¥{{ formatNum(overview.totalIncome) }}</div>
                </div>
            </div>
            <div class="stat-card expense">
                <div class="stat-icon">📉</div>
                <div class="stat-info">
                    <div class="stat-label">Total Expense</div>
                    <div class="stat-value">¥{{ formatNum(overview.totalExpense) }}</div>
                </div>
            </div>
            <div class="stat-card net">
                <div class="stat-icon">💰</div>
                <div class="stat-info">
                    <div class="stat-label">Net Income</div>
                    <div class="stat-value" :class="{ negative: overview.netIncome < 0 }">¥{{
                        formatNum(overview.netIncome) }}</div>
                </div>
            </div>
            <div class="stat-card users">
                <div class="stat-icon">👥</div>
                <div class="stat-info">
                    <div class="stat-label">Total Users</div>
                    <div class="stat-value">{{ overview.totalUsers || 0 }}</div>
                </div>
            </div>
            <div class="stat-card records">
                <div class="stat-icon">📝</div>
                <div class="stat-info">
                    <div class="stat-label">Period Records</div>
                    <div class="stat-value">{{ overview.periodRecordCount || 0 }}</div>
                </div>
            </div>
            <div class="stat-card active">
                <div class="stat-icon">🔥</div>
                <div class="stat-info">
                    <div class="stat-label">Active Users</div>
                    <div class="stat-value">{{ userActivity.activeUserCount || 0 }}</div>
                </div>
            </div>
        </div>

        <!-- Charts Row -->
        <div class="charts-row">
            <!-- Trend Chart -->
            <el-card class="chart-card">
                <template #header>
                    <span class="card-title">Platform Income & Expense Trend (Last 12 Months)</span>
                </template>
                <div ref="trendChartRef" class="chart-container"></div>
            </el-card>

            <!-- Category Pie -->
            <el-card class="chart-card">
                <template #header>
                    <span class="card-title">Expense by Category</span>
                </template>
                <div ref="pieChartRef" class="chart-container"></div>
            </el-card>
        </div>

        <!-- Tables Row -->
        <div class="tables-row">
            <!-- User Ranking -->
            <el-card class="table-card">
                <template #header>
                    <div class="card-header-flex">
                        <span class="card-title">User Ranking TOP 10</span>
                        <el-select v-model="rankBy" style="width: 120px" @change="loadUserRanking">
                            <el-option label="By Expense" value="expense" />
                            <el-option label="By Income" value="income" />
                        </el-select>
                    </div>
                </template>
                <el-table :data="userRankingList" stripe size="small">
                    <el-table-column label="#" width="50">
                        <template #default="{ row }">{{ row.rank }}</template>
                    </el-table-column>
                    <el-table-column label="User">
                        <template #default="{ row }">{{ row.nickName || row.userName }}</template>
                    </el-table-column>
                    <el-table-column label="Amount" width="140">
                        <template #default="{ row }">
                            <span class="amount-text">¥{{ formatNum(row.amount) }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

            <!-- User Activity / Frequency Ranking -->
            <el-card class="table-card">
                <template #header>
                    <div class="card-header-flex">
                        <span class="card-title">Record Frequency Ranking</span>
                        <div class="activity-badges">
                            <span class="badge">New Users: {{ userActivity.newUserCount || 0 }}</span>
                        </div>
                    </div>
                </template>
                <el-table :data="userActivity.frequencyRanking || []" stripe size="small">
                    <el-table-column label="#" width="50">
                        <template #default="{ row }">{{ row.rank }}</template>
                    </el-table-column>
                    <el-table-column label="User">
                        <template #default="{ row }">{{ row.nickName || row.userName }}</template>
                    </el-table-column>
                    <el-table-column label="Records" width="100">
                        <template #default="{ row }">{{ row.recordCount }}</template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>

        <!-- Budget Overview -->
        <el-card class="budget-card">
            <template #header>
                <span class="card-title">Budget Execution Overview</span>
            </template>
            <div class="budget-stats">
                <div class="budget-stat-item">
                    <div class="budget-stat-label">Total Budgets</div>
                    <div class="budget-stat-value">{{ budgetData.totalBudgetCount || 0 }}</div>
                </div>
                <div class="budget-stat-item">
                    <div class="budget-stat-label">Over Budget</div>
                    <div class="budget-stat-value danger">{{ budgetData.overBudgetCount || 0 }}</div>
                </div>
                <div class="budget-stat-item">
                    <div class="budget-stat-label">Over Budget Rate</div>
                    <div class="budget-stat-value" :class="{ danger: budgetData.overBudgetRate > 50 }">{{
                        budgetData.overBudgetRate || 0 }}%</div>
                </div>
                <div class="budget-stat-item">
                    <div class="budget-stat-label">Avg Execution Rate</div>
                    <div class="budget-stat-value">{{ budgetData.avgExecutionRate || 0 }}%</div>
                </div>
            </div>
            <el-table v-if="budgetData.overBudgetList && budgetData.overBudgetList.length > 0"
                :data="budgetData.overBudgetList" stripe size="small" style="margin-top: 16px">
                <el-table-column label="User" width="120">
                    <template #default="{ row }">{{ row.userName }}</template>
                </el-table-column>
                <el-table-column label="Budget Name">
                    <template #default="{ row }">{{ row.budgetName }}</template>
                </el-table-column>
                <el-table-column label="Budget Amount" width="130">
                    <template #default="{ row }">¥{{ formatNum(row.budgetAmount) }}</template>
                </el-table-column>
                <el-table-column label="Used Amount" width="130">
                    <template #default="{ row }">
                        <span class="danger">¥{{ formatNum(row.usedAmount) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="Usage Rate" width="100">
                    <template #default="{ row }">
                        <span class="danger">{{ row.usageRate }}%</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- Large Transactions -->
        <el-card class="large-tx-card">
            <template #header>
                <div class="card-header-flex">
                    <span class="card-title">Large Transaction Monitor</span>
                    <el-input-number v-model="minAmount" :min="100" :step="500" style="width: 160px"
                        @change="loadLargeTransactions" />
                </div>
            </template>
            <el-table :data="largeTransactions" stripe size="small">
                <el-table-column label="User" width="100">
                    <template #default="{ row }">{{ row.userName }}</template>
                </el-table-column>
                <el-table-column label="Direction" width="90">
                    <template #default="{ row }">
                        <el-tag :type="row.directionType === 1 ? 'success' : 'danger'" size="small">{{
                            row.directionLabel }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Category" width="120">
                    <template #default="{ row }">{{ row.emoji }} {{ row.typeName }}</template>
                </el-table-column>
                <el-table-column label="Amount" width="130">
                    <template #default="{ row }">
                        <span class="amount-text large">¥{{ formatNum(row.amount) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="Trade Time" width="170">
                    <template #default="{ row }">{{ row.tradeTime }}</template>
                </el-table-column>
                <el-table-column label="Remark">
                    <template #default="{ row }">{{ row.remark }}</template>
                </el-table-column>
                <el-table-column label="Trader" width="100">
                    <template #default="{ row }">{{ row.trader }}</template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup>
import { post } from '@/api/http';
import * as echarts from 'echarts';
import { computed, nextTick, onMounted, ref } from 'vue';

const now = new Date();
const period = ref('month');
const selectedYear = ref(now.getFullYear());
const selectedMonth = ref(now.getMonth() + 1);
const selectedQuarter = ref(Math.ceil((now.getMonth() + 1) / 3));

const yearOptions = computed(() => {
    const y = now.getFullYear();
    return [y - 2, y - 1, y];
});

const overview = ref({});
const userActivity = ref({});
const userRankingList = ref([]);
const budgetData = ref({});
const largeTransactions = ref([]);
const minAmount = ref(1000);
const rankBy = ref('expense');

const trendChartRef = ref(null);
const pieChartRef = ref(null);
let trendChart = null;
let pieChart = null;

const buildParams = () => {
    const params = { period: period.value, year: selectedYear.value };
    if (period.value === 'month') params.month = selectedMonth.value;
    if (period.value === 'quarter') params.quarter = selectedQuarter.value;
    return params;
};

const formatNum = (val) => {
    if (val == null || isNaN(val)) return '0.00';
    return Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const loadOverview = async () => {
    const { data, success } = await post('/adminStatistics/overview', buildParams());
    if (success) overview.value = data || {};
};

const loadUserActivity = async () => {
    const { data, success } = await post('/adminStatistics/userActivity', buildParams());
    if (success) userActivity.value = data || {};
};

const loadPlatformTrend = async () => {
    const { data, success } = await post('/adminStatistics/platformTrend', {});
    if (success) {
        await nextTick();
        initTrendChart(data);
    }
};

const loadCategoryPie = async () => {
    const { data, success } = await post('/adminStatistics/platformCategoryPie', buildParams());
    if (success) {
        await nextTick();
        initPieChart(data);
    }
};

const loadUserRanking = async () => {
    const params = { ...buildParams(), rankBy: rankBy.value };
    const { data, success } = await post('/adminStatistics/userRanking', params);
    if (success) userRankingList.value = data?.items || [];
};

const loadBudgetOverview = async () => {
    const { data, success } = await post('/adminStatistics/budgetOverview', {
        year: selectedYear.value,
        month: selectedMonth.value
    });
    if (success) budgetData.value = data || {};
};

const loadLargeTransactions = async () => {
    const params = { ...buildParams(), minAmount: minAmount.value };
    const { data, success } = await post('/adminStatistics/largeTransactions', params);
    if (success) largeTransactions.value = data?.items || [];
};

const initTrendChart = (data) => {
    if (!trendChartRef.value || !data) return;
    if (trendChart) trendChart.dispose();
    trendChart = echarts.init(trendChartRef.value);
    trendChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['Income', 'Expense'], bottom: 0 },
        grid: { left: 60, right: 20, top: 20, bottom: 40 },
        xAxis: { type: 'category', data: data.months || [] },
        yAxis: { type: 'value' },
        series: [
            { name: 'Income', type: 'line', smooth: true, data: data.incomeList || [], itemStyle: { color: '#10b981' } },
            { name: 'Expense', type: 'line', smooth: true, data: data.expenseList || [], itemStyle: { color: '#ef4444' } }
        ]
    });
};

const initPieChart = (data) => {
    if (!pieChartRef.value || !data) return;
    if (pieChart) pieChart.dispose();
    pieChart = echarts.init(pieChartRef.value);
    const items = (data.items || []).map(i => ({ name: i.typeName, value: i.amount }));
    pieChart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)' },
        legend: { orient: 'vertical', right: 10, top: 'center' },
        series: [{
            type: 'pie', radius: ['40%', '70%'], center: ['40%', '50%'],
            label: { show: false },
            data: items
        }]
    });
};

const loadAll = async () => {
    await Promise.all([
        loadOverview(),
        loadUserActivity(),
        loadPlatformTrend(),
        loadCategoryPie(),
        loadUserRanking(),
        loadBudgetOverview(),
        loadLargeTransactions()
    ]);
};

const switchPeriod = (p) => {
    period.value = p;
    loadAll();
};

onMounted(() => {
    loadAll();
    window.addEventListener('resize', () => {
        trendChart?.resize();
        pieChart?.resize();
    });
});
</script>

<style scoped lang="scss">
.admin-statistics {
    width: 100%;
    box-sizing: border-box;
}

.period-card {
    margin-bottom: 20px;

    .period-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .period-tabs {
        display: flex;
        gap: 4px;
        background: #f1f5f9;
        border-radius: 8px;
        padding: 4px;
    }

    .period-tab {
        padding: 6px 16px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        color: #64748b;
        transition: all 0.2s;

        &.active {
            background: #ffffff;
            color: #0f172a;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
    }

    .period-selectors {
        display: flex;
        gap: 8px;
    }
}

.stat-cards {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
    margin-bottom: 20px;
}

.stat-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

    .stat-icon {
        font-size: 28px;
    }

    .stat-label {
        font-size: 12px;
        color: #64748b;
        margin-bottom: 4px;
    }

    .stat-value {
        font-size: 20px;
        font-weight: 700;
        color: #0f172a;

        &.negative {
            color: #ef4444;
        }
    }
}

.charts-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
}

.chart-card {
    .chart-container {
        height: 320px;
    }
}

.tables-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
}

.card-title {
    font-size: 15px;
    font-weight: 600;
    color: #0f172a;
}

.card-header-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.amount-text {
    font-weight: 600;
    color: #0f172a;

    &.large {
        font-size: 15px;
        color: #dc2626;
    }
}

.badge {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    background: #f0fdf4;
    color: #16a34a;
}

.budget-card {
    margin-bottom: 20px;

    .budget-stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
    }

    .budget-stat-item {
        text-align: center;
        padding: 16px;
        background: #f8fafc;
        border-radius: 10px;
    }

    .budget-stat-label {
        font-size: 12px;
        color: #64748b;
        margin-bottom: 6px;
    }

    .budget-stat-value {
        font-size: 24px;
        font-weight: 700;
        color: #0f172a;

        &.danger {
            color: #ef4444;
        }
    }
}

.large-tx-card {
    margin-bottom: 20px;
}

.danger {
    color: #ef4444;
    font-weight: 600;
}
</style>
