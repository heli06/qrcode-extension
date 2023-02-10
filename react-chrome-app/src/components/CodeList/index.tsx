import React, { useEffect, useState } from "react";
import { Button, Form, Input, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { ItemData, PanelData } from "../../type";
import "./index.css";

function CodeList({ setData, index, list }: { setData: Function, index: number, list: Array<ItemData> }) {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    setData((preVal: Array<PanelData>) => {
      const val = [...preVal];
      val[index] = values.items;
      return val;
    })
  };

  useEffect(() => {
    if (list?.length > 0) {
      form.setFieldsValue({
        items: list
      })
    }
  }, [form, list]);

  return (
    <Form 
      form={form}
      onFinish={onFinish}>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: "flex", marginBottom: 8 }}
                align="baseline"
              >
                <Form.Item
                  {...restField}
                  name={[name, "text"]}
                  rules={[{ required: true, message: "请填写链接" }]}
                >
                  <Input placeholder="链接" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "url"]}
                >
                  <Input placeholder="备注" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
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
