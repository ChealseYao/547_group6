<template>
  <main v-loading="loading" class="p-3 lyear-layout-content">
    <h1 class="fontSize mb-3">BlueSky Sentiment Analysis Dashboard</h1>
    <div class="container-fluid">
      <form @submit.prevent="submitData">
        <div class="row">
          <!-- Username -->
          <div class="col-md-3 col-xl-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex">
                  <span class="avatar-md rounded-circle bg-white bg-opacity-25 avatar-box">
                    <i class="mdi mdi-account fs-4"></i>
                  </span>
                  <span class="fs-4 mb-2">Username</span>
                </div>
                <div class="text-end font-weight-bold">
                  <input v-model="username" placeholder="Enter your username" class="form-control" />
                </div>
              </div>
            </div>
          </div>
          <!-- Password -->
          <div class="col-md-3 col-xl-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex">
                  <span class="avatar-md rounded-circle bg-white bg-opacity-25 avatar-box">
                    <i class="mdi mdi-lock fs-4"></i>
                  </span>
                  <span class="fs-4 mb-2">Password</span>
                </div>
                <div class="text-end font-weight-bold">
                  <input type="password" v-model="password" placeholder="Enter your password" class="form-control" />
                </div>
              </div>
            </div>
          </div>
          <!-- Year -->
          <div class="col-md-3 col-xl-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex">
                  <span class="avatar-md rounded-circle bg-white bg-opacity-25 avatar-box">
                    <i class="mdi mdi-calendar fs-4"></i>
                  </span>
                  <span class="fs-4 mb-2">Year</span>
                </div>
                <div class="text-end font-weight-bold">
                  <el-select v-model="year" placeholder="Select year" size="large">
                    <el-option
                      v-for="y in years"
                      :key="y"
                      :label="y"
                      :value="y"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
          <!-- Month -->
          <div class="col-md-3 col-xl-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex">
                  <span class="avatar-md rounded-circle bg-white bg-opacity-25 avatar-box">
                    <i class="mdi mdi-calendar fs-4"></i>
                  </span>
                  <span class="fs-4 mb-2">Month</span>
                </div>
                <div class="text-end font-weight-bold">
                  <el-select v-model="month" placeholder="Select month" size="large">
                    <el-option
                      v-for="m in months"
                      :key="m"
                      :label="m"
                      :value="m"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-3">
          <!-- Query -->
          <div class="col-md-12">
            <div class="card">
              <div class="card-body">
                <div class="d-flex">
                  <span class="avatar-md rounded-circle bg-white bg-opacity-25 avatar-box">
                    <i class="mdi mdi-magnify fs-4"></i>
                  </span>
                  <span class="fs-4 mb-2">Query</span>
                </div>
                <div class="text-end font-weight-bold">
                  <input v-model="query" placeholder="Enter your query" class="form-control" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-md-12 text-center">
            <button  type="submit" class="btn btn-primary mt-3">Submit</button>
          </div>
        </div>
      </form>

      <!-- Charts -->
      <div class="row mt-5">
        <!-- Chart 1 -->
        <div class="col-md-6 col-xl-6">
          <div class="card">
            <div class="card-body">
              <h4>Sentiment Statistics</h4>
              <QTEcharts :options="options" style="height: 400px;" />
            </div>
          </div>
        </div>
        <!-- Chart 2 -->
        <div class="col-md-6 col-xl-6">
          <div class="card">
            <div class="card-body">
              <h4>Daily Sentiment Trends</h4>
              <QTEcharts :options="options1" style="height: 400px;" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { getData,setSubmit } from '@/api'
import { getOptions, getOptions1 } from './index';
import QTEcharts from '@/components/Echarts/index.vue';
import { ref } from 'vue';

// Form Data Binding
const username = ref('');
const password = ref('');
const year = ref(new Date().getFullYear());
const month = ref(new Date().getMonth());
const query = ref('');
const sentiment = reactive({
  POSITIVE: 0,
  NEGATIVE: 0,
  NEUTRAL: 0,
  MIXED: 0
})

// Chart Data Binding
const options = ref({});
const options1 = ref({});
const loading = ref(false)

// Year and month options
const years = ref(Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i));
const months = ref(Array.from({ length: 12 }, (_, i) => i + 1));
const  countSentiments =  (dataArray) =>{
  const result = {}
  dataArray.forEach(({ fileName, content }) => {
    const date = fileName.match(/\d{4}-\d{2}-\d{2}/)[0]
    if (!result[date]) {
      result[date] = {
        POSITIVE: 0,
        NEGATIVE: 0,
        NEUTRAL: 0,
        MIXED: 0
      }
    }
    content.forEach(({ sentiment }) => {
      result[date][sentiment]++
    })
  })
  return result
}
// Chart data loading and updating
const fetchAndVisualizeData = async () => {
  
  if (!query.value) {
    console.warn('Query is empty. Skipping data fetch.');
    return;
  }
  const _month = month.value<10?`0${month.value}`:month.value
  try {
    const response = await getData({year:year.value,month: _month})
    let day = countSentiments(response)
    for (let key in day) {
      sentiment.POSITIVE += day[key].POSITIVE
      sentiment.NEGATIVE += day[key].NEGATIVE
      sentiment.NEUTRAL += day[key].NEUTRAL
      sentiment.MIXED += day[key].MIXED
    }
    options.value =  getOptions(sentiment)
    options1.value =  getOptions1(day)
    // const response = await fetch(
    //   `/api/get-data?year=${year.value}&month=${month.value}`
    // );
    // if (!response.ok) throw new Error('Failed to fetch data');
    // const data = await response.json();
    //
    // options.value = getOptions(data.sentiment || {});
    // options1.value = getOptions1(data.dailyTrends || {});
    // console.log('Visualization data fetched successfully:', data);
  } catch (error) {
    console.error('Error fetching visualization data:', error);
    alert('An error occurred while fetching visualization data.');
  }
};

// Uploading form data
const submitData = async () => {
  const payload = {
    username: username.value,
    password: password.value,
    year: year.value,
    month: month.value,
    query: query.value,
  };
  // const body={
  //   "username":"chenxiyao.bsky.social",
  //   "password":"zgs135688",
  //   "year":2024,
  //   "month":11,
  //   "query":"election"
  // }
  loading.value = true
  try {
    const response = await  setSubmit(payload).finally(()=>{
      loading.value = false
    })
    // const response = await fetch('/api/default/lambda-bluesky', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // });
    // const data = await response.json();
    console.log('Server response:', response);

    if (response.status==='success') {
      alert('Data uploaded successfully!');
      await fetchAndVisualizeData(); // Refresh chart after successful submission
    } else {
      alert(`Upload failed: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error submitting data:', error);
    alert('An error occurred while uploading data.');
  }
};

// Initialize page data
const init = async () => {
  try {
    await fetchAndVisualizeData();
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

init();
</script>

<style lang="scss" scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}
.fontSize {
  font-size: 26px;
  font-weight: 800;
}
</style>
<style>
.el-select__wrapper {
  box-shadow: none;
  height: 18px !important;
  line-height: 18px !important;
  min-height: 18px !important;
}
</style>
