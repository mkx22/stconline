package com.example.stc.prefab;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.example.stc.StcApplication;
import com.example.stc.activiti.ProcessState;
import com.example.stc.domain.Contract;
import com.example.stc.domain.Entrust;
import com.example.stc.domain.User;
import com.example.stc.repository.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DataBaseReset {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntrustRepository entrustRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private TestPlanRepository testPlanRepository;

    @Autowired
    private TestReportRepository testReportRepository;

    @Autowired
    private TestRecordRepository testRecordRepository;

    private JSONObject getJson(String filename) {
        String path = "target/classes/prefab/" + filename;
        System.out.println("*****Load File: " + path);
        String jsonStr = "";
        try {
            File jsonFile = new File(path);
            FileReader fileReader = new FileReader(jsonFile);
            Reader reader = new InputStreamReader(new FileInputStream(jsonFile),"UTF-8");
            int ch = 0;
            StringBuffer sb = new StringBuffer();
            while ((ch = reader.read()) != -1) {
                sb.append((char) ch);
            }
            fileReader.close();
            reader.close();
            jsonStr = sb.toString();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
        // 将String转为JsonObject
        JSONObject jsonObject = JSON.parseObject(jsonStr);
        return jsonObject;
    }

    @Test
    public void getDataFromJsonTest() {
        JSONObject jsonObject = getJson("test.json");
        assertThat(jsonObject).isNotNull();
        assertThat(jsonObject.getString("key")).isEqualTo("value");
    }

    private void saveUser(JSONObject usersJson, String keyName, List<User> users) {
        User user = JSON.toJavaObject(usersJson.getJSONObject(keyName), User.class);
        assertThat(user).isNotNull();
        users.add(user);
        System.out.println("Save " + user.getUsername() + ": uid = " + user.getUserID() +
                ", roles = " + user.getRoles());
        userRepository.save(user);
    }

    private void saveEntrust(JSONObject entrustJson, String pid, String uid, String name) {
        Entrust entrust = JSON.toJavaObject(entrustJson, Entrust.class);
        assertThat(entrust).isNotNull();
        entrust.setPid(pid);
        entrust.setUserId(uid);
        entrust.setSoftwareName(name);
        entrust.setProcessState(ProcessState.Submit); // 待提交（未进入流程）
        System.out.println("Save " + entrust.getSoftwareName() + ": pid = " + entrust.getPid() +
                ", userId = " + entrust.getUserId());
        // TODO：修正多选框后注释此行
        debugEntrust(entrust);
        entrustRepository.save(entrust);
    }

    // 以免多选框出问题，无bug情况不应使用此方法
    private void debugEntrust(Entrust entrust) {
        entrust.setAntiVirus("basic-form.others.viruses.complete");
        entrust.setCheckSample("\"\"");
        entrust.setClientSystem("[\"basic-form.radio.opsystem1\",\"basic-form.radio.opsystem3\"]");
        entrust.setEncryptionLev("basic-form.others.SecLev.public");
        entrust.setSampleChoice("form.sample.radio.destruction");
        entrust.setSampleType("basic-form.mediumg.label");
        entrust.setServerHardFrame("\"\"");
        entrust.setServerSoftFrame("\"\"");
        entrust.setSoftwareType("basic-form.radio.system1");
        entrust.setTestBasis("\"basic-form.radio.basis1\"");
        entrust.setTestSpecification("[\"basic-form.radio.target2\",\"basic-form.radio.target5\",\"basic-form.radio.target4\",\"basic-form.radio.target1\",\"basic-form.radio.target7\"]");
        entrust.setTestType("[\"basic-form.radio.confirm\"]");
        entrust.setUnitProperty("basic-form.radio.domestic");
    }

    @Test
    public void resetDataBase() {
        System.out.println("\n----------------------------------");
        System.out.println("Data Base Reset Start");
        // 重设全部User帐户
        userRepository.deleteAll();
        System.out.println("\nReset All Users:");
        JSONObject usersJson = getJson("users.json");
        String[] keyNames = {"boss", "cusa", "cusb", "cusc", "ssa", "ssb", "tsa", "tsb"
                , "sma", "tma", "qma", "admin"};
        List<User> users = new ArrayList<>();
        for (String keyName: keyNames)
            saveUser(usersJson, keyName, users);
        // 重设全部委托
        entrustRepository.deleteAll();
        System.out.println("\nReset All Entrusts:");
        JSONObject entrustJson = getJson("entrust.json");
        saveEntrust(entrustJson, "p20190610010101", users.get(0).getUserID(), "ABCDE软件"); // CUSA
        saveEntrust(entrustJson, "p20190610010102", users.get(0).getUserID(), "Hello软件"); // CUSA
        saveEntrust(entrustJson, "p20190610010103", users.get(0).getUserID(), "World软件"); // CUSA
        saveEntrust(entrustJson, "p20190610010104", users.get(0).getUserID(), "ABCDE软件"); // CUSA
        saveEntrust(entrustJson, "p20190610010105", users.get(0).getUserID(), "Hello软件"); // CUSA
        saveEntrust(entrustJson, "p20190610010106", users.get(0).getUserID(), "World软件"); // CUSA
        saveEntrust(entrustJson, "p20190610010107", users.get(0).getUserID(), "ABCDE软件"); // CUSA
        saveEntrust(entrustJson, "p20190610010108", users.get(0).getUserID(), "Hello软件"); // CUSA
        saveEntrust(entrustJson, "p20190610010109", users.get(0).getUserID(), "World软件"); // CUSA
        saveEntrust(entrustJson, "p20190610010110", users.get(0).getUserID(), "ABCDE软件"); // CUSA
        saveEntrust(entrustJson, "p20190610010111", users.get(0).getUserID(), "Hello软件"); // CUSA
        saveEntrust(entrustJson, "p20190610010112", users.get(0).getUserID(), "World软件"); // CUSA

        saveEntrust(entrustJson, "p20190610010113", users.get(1).getUserID(), "Game软件"); // CUSB
        saveEntrust(entrustJson, "p20190610010114", users.get(1).getUserID(), "LittleBird软件"); // CUSB
        // 清空其他数据库
        contractRepository.deleteAll();
        testPlanRepository.deleteAll();
        testReportRepository.deleteAll();
        testRecordRepository.deleteAll();
        System.out.println("\nData Base Reset Complete");
        System.out.println("----------------------------------");
    }

}
