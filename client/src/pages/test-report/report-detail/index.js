import { Card, Table, Divider, Button, Tag ,Breadcrumb, Form} from 'antd';
import React from "react";
import {connect} from "dva";
import { FormattedMessage } from 'umi/locale';
import {getRole} from "../../../utils/cookieUtils";


const namespace = 'report-detail';

const mapStateToProps = (state) => {
  const reportdata = state[namespace];
  console.log(reportdata.data);
  return {
    reportdata,
  };
};

@Form.create()
@connect(mapStateToProps)
export default class report_detail extends React.Component{
  constructor(props){
    super(props)
    this.state={
      pid:"",
      comment:""
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    console.log(this.props.location.query)
    dispatch({
      type: `${namespace}/GetOneTestReport`,
      payload: this.props.location.query,
    });
  }

  review = (form,operation) => {
    const {dispatch} = this.props;
    this.state.pid = this.props.reportdata.data.pid;
    this.state.comment = this.props.reportdata.data.comment;
    form.validateFields((err, value) => {
      var checkvalue = this.props.reportdata.data;
      checkvalue.operation = operation;
      checkvalue.comment = value.comment;
      dispatch({
        type: `${namespace}/queryReviewTestReport`,
        payload: checkvalue,
      });
    })
  }

  render(){
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item href="/welcome.html">主页</Breadcrumb.Item>
          <Breadcrumb.Item>测试方案详情</Breadcrumb.Item>
        </Breadcrumb>

        <Card>
          <h2>软件委托测试报告</h2>
          <p>项目编号：<FormattedMessage id={this.props.reportdata.data.codeId || ' '}/></p>

          <p>软件名称：<FormattedMessage id={this.props.reportdata.data.softwareName || ' '}/></p>
          <p>版本号：<FormattedMessage id={this.props.reportdata.data.version || ' '}/></p>
          <p>委托单位：<FormattedMessage id={this.props.reportdata.data.clientCompany || ' '}/></p>
          <p>测试类别：<FormattedMessage id={this.props.reportdata.data.testType || ' '}/></p>
          <p>报告日期：<FormattedMessage id={this.props.reportdata.data.reportDate || ' '}/></p>
          
          <p>样品名称：<FormattedMessage id={this.props.reportdata.data.sampleName || ' '}/></p>
          <p>采样日期：<FormattedMessage id={this.props.reportdata.data.sampleDate || ' '}/></p>
          <p>测试日期：<FormattedMessage id={this.props.reportdata.data.testDate || ' '}/></p>
          <p>样品状态：<FormattedMessage id={this.props.reportdata.data.sameState || ' '}/></p>
          <p>测试依据：<FormattedMessage id={this.props.reportdata.data.testBasis || ' '}/></p>
          <p>样品清单：<FormattedMessage id={this.props.reportdata.data.sampleMenu || ' '}/></p>
          <p>测试结论：<FormattedMessage id={this.props.reportdata.data.testConclusion || ' '}/></p>
          <p>主测人：<FormattedMessage id={this.props.reportdata.data.tester || ' '}/></p>
          <p>主测人测试日期：<FormattedMessage id={this.props.reportdata.data.testerDate || ' '}/></p>
          <p>审核人：<FormattedMessage id={this.props.reportdata.data.auditor || ' '}/></p>
          <p>批准人：<FormattedMessage id={this.props.reportdata.data.approver || ' '}/></p>
          <p>批准日期：<FormattedMessage id={this.props.reportdata.data.approverDate || ' '}/></p>
          <p>委托单位电话：<FormattedMessage id={this.props.reportdata.data.clientTel || ' '}/></p>
          <p>委托单位传真：<FormattedMessage id={this.props.reportdata.data.clientFax || ' '}/></p>
          <p>委托单位地址：<FormattedMessage id={this.props.reportdata.data.clientAddr || ' '}/></p>
          <p>测试执行记录：<FormattedMessage id={this.props.reportdata.data.testExeRecord || ' '}/></p>
          <p>流程ID：<FormattedMessage id={this.props.reportdata.data.processInstanceId || ' '}/></p>
          <p>流程状态：<FormattedMessage id={this.props.reportdata.data.processState || ' '}/></p>
        </Card>

        {/* <Card>
          <h1>一、任务表述</h1>
        </Card> */}
        {/* <Card>
          <h1>二、双方的主要义务</h1>
        </Card> */}
        <br />
        {
          {
         
            "CUS":
            <div>
              {/* <Descriptions title="客户">
                <Descriptions.Item label="委托状态">审核未通过</Descriptions.Item>
                <Descriptions.Item label="委托意见">重写</Descriptions.Item>
                <Descriptions.Item label="已提交样品">a.zip</Descriptions.Item>
              </Descriptions> */}
              <Button
              style={{marginLeft: 350}}
              type="primary"
              onClick={() => {
                this.review(this.props.form,"ReviewPass")
              }}
              >确认</Button>
              <Button
              style={{marginLeft: 20}}
              type="danger"
              onClick={() => {
                this.review(this.props.form,"ReviewDisprove")
              }}
              >拒绝</Button>
            </div>,

            // "SM":
            // <div>
            //   <h1>市场部主任</h1>
            //   <Button
            //   style={{marginLeft: 350}}
            //   type="primary"
            //   onClick={() => {
            //     this.review(this.props.form,"ReviewPass")
            //   }}
            //   >通过</Button>
            //   <Button
            //   style={{marginLeft: 20}}
            //   type="danger"
            //   >不通过</Button>
            // </div>,
            "TM":
            <div>
              <h1>测试部主任</h1>
              <Button
              style={{marginLeft: 350}}
              type="primary"
              onClick = {() => {
                this.review(this.props.form,"ReviewPass")
              }}
              >通过</Button>
              <Button
              style={{marginLeft: 20}}
              type="danger"
              onClick={() => {
                this.review(this.props.form,"ReviewDisprove")
              }}
              >不通过</Button>
            </div>,
            "QM":
            <div>
              <h1>质量部主任</h1>
              <Button
              style={{marginLeft: 350}}
              type="primary"
              onClick={() => {
                this.review(this.props.form,"ReviewPass")
              }}
              >通过</Button>
              <Button
              style={{marginLeft: 20}}
              type="danger"
              onClick={() => {
                this.review(this.props.form,"ReviewDisprove")
              }}
              >不通过</Button>
            </div>,
          }[getRole()[0]]
        }

      </div>
    )
  }

};






