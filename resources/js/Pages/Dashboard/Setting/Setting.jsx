import React from "react";
import Layout from "../Layout";
import ComingSoon from "@/components/ui/comingSoon";
import SettingPageComponent from "../../../components/dashboard/setting/SettingPageComponent";

function Setting() {
    return <SettingPageComponent />;
}

Setting.layout = (page) => <Layout children={page} title="Welcome" />;

export default Setting;
