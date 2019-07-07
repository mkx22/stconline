package com.example.stc.controller;

import com.example.stc.domain.TestReport;
import com.example.stc.framework.util.AuthorityUtils;
import com.example.stc.service.TestReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * 测试报告相关接口
 */
@RestController
public class TestReportController extends BaseController {

    Logger logger = LoggerFactory.getLogger(EntrustController.class);

    @Autowired
    private TestReportService testReportService;

    @Autowired
    private AuthorityUtils authorityUtils;

    /**
     * 查看全部测试报告
     * CUS, SS, TS, TM, QM可查看
     */
    @Secured({"ROLE_CUS", "ROLE_SS", "ROLE_TS", "ROLE_TM", "ROLE_QM"})
    @GetMapping(path = "/testReport")
    public @ResponseBody
    Resources<Resource<TestReport>> getAllTestReport() {
        // 依据当前登录的用户的权限查询能见的测试报告
        List<Resource<TestReport>> testReports = testReportService.findTestReportsByAuthority().stream()
                .map(testReport -> new Resource<>(testReport))
                .collect(Collectors.toList());
        logger.info("getAllTestReport: 最终查询测试报告数：" + testReports.size());
        return new Resources<>(testReports,
                linkTo(methodOn(TestReportController.class).getAllTestReport()).withSelfRel());
    }

    /**
     * 查看单个测试报告
     * CUS, SS, TS, TM, QM可查看
     * 除TS以外仅审核之后可查看
     */
    @Secured({"ROLE_CUS", "ROLE_SS", "ROLE_TS", "ROLE_TM", "ROLE_QM"})
    @GetMapping(path = "/testReport/{pid}")
    public @ResponseBody
    Resource<TestReport> getOneTestReport(@PathVariable String pid) {
        TestReport testReport = testReportService.findTestReportByPid(pid);
        authorityUtils.stateAccessCheck(testReport, "CUS,SS,TM,QM", "Review,Approve", "查看");
        logger.info("getOneTestReport");
        return toResource(testReport, methodOn(TestReportController.class).getOneTestReport(pid));
    }

    /**
     * 新建测试报告
     * @throws URISyntaxException
     */
    @PostMapping(path = "/testReport/{pid}")
    public @ResponseBody
    ResponseEntity<?> addNewTestReport(@PathVariable String pid, @RequestParam String uid) throws URISyntaxException {
        Resource<TestReport> resource = new Resource<>(testReportService.newTestReport(pid, uid));
        return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
    }

    /**
     * 修改单个测试报告
     * 仅TS在Submit阶段可修改
     * @throws URISyntaxException
     */
    @Secured({"ROLE_TS"}) // 测试部工作人员
    @PutMapping(path = "/testReport/{pid}")
    public @ResponseBody
    ResponseEntity<?> replaceTestReport(@PathVariable String pid, @RequestBody TestReport testReport) throws URISyntaxException {
        authorityUtils.stateAccessCheck(testReport, "TS", "Submit", "修改");
        logger.info("replaceTestReport");
        TestReport updatedTestReport = testReportService.updateTestReport(pid, testReport);
        Resource<TestReport> resource = new Resource<>(updatedTestReport);
        return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
    }

    /**
     * 删除单个测试报告
     * 仅TS在Submit阶段可删除
     */
    @DeleteMapping(path = "/testReport/{pid}")
    public @ResponseBody
    ResponseEntity<?> deleteTestReport(@PathVariable String pid) {
        TestReport testReport = testReportService.findTestReportByPid(pid);
        authorityUtils.stateAccessCheck(testReport, "TS", "Submit", "删除");
        logger.info("deleteTestReport");
        testReportService.deleteTestReportByPid(pid);
        return ResponseEntity.noContent().build();
    }

}