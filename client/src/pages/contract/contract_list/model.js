import { getAllContract,deleteContract} from '@/services/contract';
import router from "umi/router";

export default {
  namespace:'contractList',
  state: {
    data: [],
    counter: 0,
  },
  effects:{
    //派发一个queryInitPlans的action
    *queryInitContracts(_,{call,put}) {
      //获取服务器端数据
      const response = yield call(getAllContract);
      // console.log('GetAllContract')
      // console.log(response);

      // 处理未登录情况：重定向到登陆界面
      console.log(response.status)
      if (response.status === 401) {
        router.push("/user-login.html");
      }
      else {
        //_embedded复制粘贴的委托
        // console.log('_embedded' in response);
        if (!('_embedded' in response)) {
          // console.log("put []");
          //执行getPlanData
          yield put({type: 'getData', payload: response});
        } else {
          yield put({type: 'getData', payload: response._embedded.contracts});
        }
      }
    },

    *queryDeleteCon({payload},{call,put}){
      //console.log("到这里啦")
      yield call(deleteContract,{pid:payload.pid})
      //console.log(response)
      const list=yield call(getAllContract)
      //console.log(list)
      console.log('_embedded' in list)
      if(!('_embedded' in list)){
        console.log("XXXXXXXXXX")
        yield put({type:'getData',payload: list})
      }
      else{
        console.log("WWWWWWWWWWW")
        yield put({type:'getData',payload: list._embedded.contracts})
      }
    }

  },
  //响应action并修改state
  reducers:{
    getData(state,action){
      return{
        ...state,
        data:action.payload,
      }
    },
  },
};
