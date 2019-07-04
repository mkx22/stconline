import request from '@/utils/request';

/**
 * 获取所有的测试方案
 * */
export async function getAllTestPlan() {
  return request('api/project/testplan');
}

/**
 * 根据pid获取测试方案
 * */
export async function getOneTestPlan({pid}) {
  return request(`api/project/testplan/${pid}`);
}

/**
 * 新增测试方案
 * */
export async function addNewTestPlan(data) {
  return request(`dev/api/project/testplan`, {
    method: 'POST',
    data: data,
  });
}

/**
 * 删除测试方案
 * */
export async function deleteTestPlan({pid}) {
  return request(`api/project/testplan/${pid}`, {
    method: 'DELETE',
  });
}

/**
 * 修改测试方案
 * */
export async function replaceTestPlan({pid, data}) {
  return request(`api/project/testplan/${pid}`, {
    method: 'PUT',
    data: data,
  });
}

/**
 * 提交测试方案
 * */
export async function submitTestPlan({pid}) {
  return request(`api/project/testplan/submit`, {
    method: 'POST',
    params: {pid}
  });
}

