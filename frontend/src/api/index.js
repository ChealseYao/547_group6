import request from '@/utils/request';

export async function postData(payload) {
  const { username, password, year, month, query } = payload;

  if (!username || !password || !year || !month || !query) {
    throw new Error('All fields (username, password, year, month, query) are required.');
  }

  try {
    // Send POST request
    const response = await request({
      // url: 'https://f97yqq59vf.execute-api.us-east-2.amazonaws.com/1/lambda-bluesky',
      // https://864r0n2dd0.execute-api.us-east-2.amazonaws.com/lambda_bluesky2/upload-data
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: payload,
    });

    // 检查响应状态
    if (response.status !== 200) {
      console.error('Error in postData response:', response.data);
      throw new Error(`Failed to upload data: ${response.data?.message || 'Unknown error'}`);
    }

    return response.data;
  } catch (error) {
    console.error('Error in postData:', error);
    throw error;
  }
}

export async function getData(params = {}) {
  const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = params;

  const url = `https://9eq245dsij.execute-api.us-east-2.amazonaws.com/prod/get-data?year=${year}&month=${month}`;
  try {
    const response = await request({
      url: url,
      method: 'GET',
    });

    // if (response.status !== 200) {
    //   console.error('Error in getData response:', response.data);
    //   throw new Error(`Failed to fetch data: ${response.data?.message || 'Unknown error'}`);
    // }

    return response;
  } catch (error) {
    console.error('Error in getData:', error);
    throw error;
  }
}

export async function setSubmit(data = {}) {
  // const url = '/api/default/lambda-bluesky';
  const baseUrl = import.meta.env.MODE == 'production'?'https://864r0n2dd0.execute-api.us-east-2.amazonaws.com':'/api'
  const url = `${baseUrl}/lambda_bluesky2/upload-data`;
  try {
    const response = await request({
      url: url,
      method: 'POST',
      data
    });

    // if (response.status !== 200) {
    //   console.error('Error in getData response:', response.data);
    //   throw new Error(`Failed to fetch data: ${response.data?.message || 'Unknown error'}`);
    // }

    return response;
  } catch (error) {
    console.error('Error in getData:', error);
    throw error;
  }
}
