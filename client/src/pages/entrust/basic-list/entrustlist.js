import React, { Component } from 'react';
import {Table,Select,Input,Button ,Breadcrumb,Divider, Tag,Menu,Modal} from 'antd';
const Search = Input.Search;
import { connect } from 'dva';
import Link from 'umi/link'
const confirm = Modal.confirm;
const namespace = 'entrustlist';

const mapStateToProps = (state) => {
  const listdata = state[namespace];
  return {
    listdata,
  };
};
const mapDispatchToProps=(dispatch)=>{
  return {
    onDidMount:()=>{
      dispatch({
        type:`${namespace}/GetAllEntrust`,
      })
    },
    DeleteEntrust:(params)=>{
      dispatch({
        type:`${namespace}/DeleteEntrust`,
        payload:params
      })
    }
  }
}
@connect(mapStateToProps,mapDispatchToProps)
export default class EntrustList extends Component {
  componentDidMount() {
    this.props.onDidMount();
  }

  columns =[
    {
      title: '委托ID',
      dataIndex: 'pid',
      key: 'pid',
      render: text => <a href="javascript:;">{text}</a>,
    },
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '委托建立时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '状态',
      key: 'processState',
      dataIndex: 'processState',
      render: processState => 
          {
            var color = processState==='Review' ? 'geekblue' : 'green'
            if (processState === '委托审核未通过') {
              color = 'volcano'
            }
            if (processState === 'Submit') {
              color = 'grey'
            }
            return (
              <Tag color={color} key={processState}>
                {processState}
              </Tag>
            );
          }
    },
    {
      title: '操作',
      key: 'action',
      render: (key) => (
        <span>
          {key.processState=='Submit'?<Link to={{pathname:'./basic-check',query:{pid:key.pid}}}>查看项目详情</Link>:<Link to={{pathname:'./basic-check',query:{pid:key.pid}}}>查看项目详情</Link>}
          <Divider type="vertical" />
          {key.processState=='Submit'?<Link to={{pathname:'../../basic-form',query:{pid:key.pid}}}>编辑</Link>:<Link disabled to={{pathname:'../../basic-form',query:{pid:key.pid}}}>编辑</Link>}
          <Divider type="vertical" />
          <span style={{color:'red', cursor:'pointer'}} onClick={this.showDeleteConfirm.bind(this, key)} >删除</span >
        </span>
      ),
    },
  ]

  showDeleteConfirm(key) {
    // console.log(key.pid)
    var that=this
    confirm({
      title: '您是否要删除本委托?',
      content: `委托ID:${key.pid}  用户名:${key.name}`,
      // content: `委托ID:`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.props.DeleteEntrust({pid:key.pid})
        
        // console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }



  render() {
    return (
      <div> 
	  <Breadcrumb>
		<Breadcrumb.Item hr ="/basic-list">委托列表</Breadcrumb.Item>
	  </Breadcrumb>
        <Select
          style={{ width: 200 }}
          defaultValue="1"
        >
          <Option value="1">按委托ID</Option>
          <Option value="2">按委托状态</Option>
        </Select>
        <Search
            style={{marginLeft:100,width: 200 }}
        />
        <Table  style={{marginTop:50 }} columns={this.columns} dataSource={this.props.listdata.data} />
		<Button
		style={{ marginLeft: 400 }}
		type="primary"
		href="/basic-form">
		新建委托
		</Button>
      </div>
    );
  }
}