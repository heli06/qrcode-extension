import React, { useEffect, useState } from "react";
import { Button, Form, Input, Space } from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import { ItemData, PanelData } from "../../type";
import "./index.css";

function CodeList({
  setData,
  index,
  list,
  setValue,
}: {
  setData: Function;
  index: number;
  list: Array<ItemData>;
  setValue: Function;
}) {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    setData((preVal: Array<PanelData>) => {
      const val = [...preVal];
      val[index].list = values.items;
      return val;
    });
  };

  useEffect(() => {
    if (list?.length > 0) {
      form.setFieldsValue({
        items: list,
      });
    }
  }, [form, list]);

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => {
              return (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <SelectOutlined onClick={() => {
                    const url = form.getFieldValue(['items', key, 'url']);
                    setValue(url);
                  }} />
                  <Form.Item
                    {...restField}
                    name={[name, "url"]}
                    rules={[{ required: true, message: "请填写链接" }]}
                  >
                    <Input placeholder="链接" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "text"]}>
                    <Input placeholder="备注" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              );
            })}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                添加链接
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </Form.Item>
    </Form>
  );
}

export default CodeList;
