import { Table, Divider, Tag ,Breadcrumb, Button, Modal} from 'antd';
import Link from 'umi/link'
import React from "react";
import {connect} from "dva";
import {getRole} from "../../../utils/cookieUtils";
//import {getRole} from "src/utils/cookieUtils"

const data=[];
var loading=true;
const namespace='contractList';
const mapStateToProps = (state) => {
  const dataList = state[namespace].data;
  //console.log("=============");
  //console.log(dataList);
  loading=false;
  return {
    dataList,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    //页面在mount完后发送一个queryInitPlans的action，被effects处理
    onDidMount: () => {
      dispatch({
        type: `${namespace}/queryInitContracts`,
      });
    },
    queryDeleteCon:(params) =>{
      dispatch({
        type:`${namespace}/queryDeleteCon`,
        payload:params
      })
    },
  };
};

const confirm = Modal.confirm;

@connect(mapStateToProps,mapDispatchToProps)
class List extends React.Component{
  componentDidMount() {
    this.props.onDidMount();
  };

  userMap={
    "SS":(key) => (
        <span>
          <Link to={{pathname: './contract_detail', query: {pid: key.pid}}}>查看详情</Link>
          <Divider type="vertical"/>
          {/*<a href="/plan_edit.html">编辑</a>*/}
          <Link to={{pathname: '../../contract_edit', query: {pid: key.pid}}}>编辑</Link>
          <Divider type="vertical"/>
          <span style={{color: 'red', cursor: 'pointer'}} onClick={this.showDeleteConfirm.bind(this,key)}>废止</span>
        </span>
    ),
    "CUS":(key) => (
      <span>
        <Link to={{pathname: './contract_detail',query: {pid: key.pid}}}>查看详情</Link>
      </span>
    ),
    "SM":(key)=>(
      <span>
        <Link to={{pathname: './contract_detail',query: {pid:key.pid}}}>查看详情</Link>
      </span>
    ),
    "QM":(key)=>(
      <span>
        <Link to={{pathname: './contract_detail',query: {pid:key.pid}}}>查看详情</Link>
      </span>
    )
  }

  columns = [
    {
      title: '方案ID',
      dataIndex: 'pid',
      key: 'pid',
      render: text => <a href="javascript:;">{text}</a>,
    },
    {
      title: '受托方',
      dataIndex: 'assignee',
      key: 'assignee',
    },
    {
      title: '状态',
      key: 'processState',
      dataIndex: 'processState',
      render: processState => {
        var color = processState === 'Approve' ? 'green' : 'geekblue';
        if (processState === 'Review') {
          color = 'geekblue';
        }
        if (processState === 'Submit') {
          color = 'grey';
        }
        return (
          //console.log(processState);
          <Tag color={color} key={processState}>
            {processState}
          </Tag>
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      render: this.link()
      // (key) => (
      //   <span>
      //     {key.processState == 'Submit' ? <Link to={{pathname: './contract_detail', query: {pid: key.pid}}}>查看详情</Link> :
      //       <Link to={{pathname: './contract_detail', query: {pid: key.pid}}}>查看详情</Link>}
      //     <Divider type="vertical"/>
      //     {/*<a href="/plan_edit.html">编辑</a>*/}
      //     {<Link to={{pathname: '../../contract_edit', query: {pid: key.pid}}}>编辑</Link>}
      //     <Divider type="vertical"/>
      //     <span style={{color: 'red', cursor: 'pointer'}} onClick={this.showDeleteConfirm.bind(this,key)}>删除</span>
      //   </span>
      // ),
    },
  ];

  link(){
    return this.userMap[getRole()[0]]
  }

  showDeleteConfirm(key) {
    var that = this;
    confirm({
      title: '您是否需要删除本合同?',
      content: `合同ID： ${key.pid}   受托方: ${key.assignee}`,
      okText: '确认删除',
      okType: 'danger',
      concelText: '取消',
      onOk() {
        //console.log("AAAAAAAAAAAAA")；
        //console.log('Cancel');
        that.props.queryDeleteCon({pid: key.pid});
        //console.log("到这里啦");
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  

  render(){
		return(
		<div>
		<Breadcrumb>
			<Breadcrumb.Item href="/welcome.html">主页</Breadcrumb.Item>
			<Breadcrumb.Item>合同列表</Breadcrumb.Item>
		</Breadcrumb>
		<br />
		<Table columns={this.columns} dataSource={(!this.props.dataList.length)?data:this.props.dataList} loading={loading} />
		{/*<Button href="/contract_new.html">新建</Button>*/}
		</div>
		);
	}
}

export default List;
