import { getOneTestReport} from '@/services/test-report';

export default {
  namespace:'report-detail',

  state: {
    data: {},
  },

  effects: {
    *GetOneTestReport({payload}, {call, put}) {
      const response = yield call(getOneTestReport, payload);
      console.log(response)
      yield put({type: 'getReportData', payload: response})
    },
  },

  //响应action并修改state
  reducers:{
    getReportData(state,action){
      return{
        ...state,
        data:action.payload,
      }
    },
  },
};
