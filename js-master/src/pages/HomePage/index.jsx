import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Space,
    Button,
    Input,
    Table,
    Card,
    Form,
    Modal,
    Upload,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";

import {
    getCustomerListAction,
    createCustomerAction,
    deleteCustomerAction,
    updateCustomerAction,
} from "../../redux/actions";

// import { convertBase64ToImage } from "../../utils";

import { convertImageToBase64 } from "../../utils/file";

import * as S from "./styles";

const HomePage = () => {
    const dispatch = useDispatch();
    const [createUserForm] = Form.useForm();
    const [updateCustomerForm] = Form.useForm();
    const [idCustomerSelected, setIdCustomerSelected] = useState(NaN);

    const [filterParams, setFilterParams] = useState({
        keyword: "",
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleFilter = (key, value) => {
        setFilterParams({
            ...filterParams,
            [key]: value,
        });
        dispatch(
            getCustomerListAction({
                params: {
                    ...filterParams,
                    [key]: value,
                },
            })
        );
    };

    const handleDeleteCustomer = (id) => {
        dispatch(deleteCustomerAction(id));
    };

    const handleUpdateCustomer = ({ id, values }) => {
        dispatch(updateCustomerAction({ id, values }));
    };

    const { customerList } = useSelector((state) => state.userReducer);

    useEffect(() => {
        dispatch(
            getCustomerListAction({
                params: {
                    ...filterParams,
                },
            })
        );
    }, []);

    const handleCreateProduct = async (values) => {
        const { images } = values;
        const newImages = [];
        for (let i = 0; i < images.length; i++) {
            const imgBase64 = await convertImageToBase64(
                images[i].originFileObj
            );
            await newImages.push({
                name: images[i].name,
                type: images[i].type,
                thumbUrl: images[i].thumbUrl,
                url: imgBase64,
            });
        }

        await dispatch(
            createCustomerAction({
                images: newImages,
                name: values.name,
                phoneNumber: values.phoneNumber,
                email: values.email,
                callback: {
                    resetFields: () => createUserForm.resetFields(),
                },
            })
        );
    };

    const handleShowModal = (custom) => {
        showModal();
        setIdCustomerSelected(custom.id);
        updateCustomerForm.setFieldsValue({
            name: custom.name,
            phoneNumber: custom.phoneNumbers[0].phoneNumber,
            email: custom.emails[0].email,
            images: custom.images,
        });
    };

    const handleSubmitUpdate = async () => {
        updateCustomerForm.submit();
        const customerUpdate = updateCustomerForm.getFieldsValue();
        const { images } = customerUpdate;
        const newImages = [];
        for (let i = 0; i < images.length; i++) {
            const imgBase64 = await convertImageToBase64(
                images[i].originFileObj
            );
            await newImages.push({
                name: images[i].name,
                type: images[i].type,
                thumbUrl: images[i].thumbUrl,
                url: imgBase64,
            });
        }

        customerUpdate.images = newImages;

        handleUpdateCustomer({
            id: idCustomerSelected,
            values: customerUpdate,
        });
        handleOk();
    };

    // const handleCreateUser = (values) => {
    //   dispatch(
    //     createCustomerAction({
    //       name: values.name,
    //       phoneNumber: values.phoneNumber,
    //       email: values.email,
    //       callback: {
    //         resetFields: () => createUserForm.resetFields(),
    //       },
    //     })
    //   );
    // };

    const dataSource = customerList.data.map((item) => {
        return {
            key: item.id,
            ...item,
        };
    });

    const columns = [
        {
            title: "???nh",
            dataIndex: "images",
            key: "images",
            render: (images) => (
                <img
                    src={
                        images[0]?.url ||
                        "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                    }
                    alt=""
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                />
            ),
        },
        {
            title: "T??n",
            dataIndex: "name",
            key: "name",
            render: (name, record) => {
                return (
                    <Space
                        key={record.id}
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        <div>{name}</div>
                    </Space>
                );
            },
        },
        {
            title: "S??? ??i???n tho???i",
            dataIndex: "phoneNumbers",
            key: "phoneNumbers",
            render: (phoneNumbers, record) => {
                const phoneNumberList = phoneNumbers.map((item) => {
                    return (
                        <Space
                            key={item.id}
                            style={{ display: "flex", alignItems: "center" }}
                        >
                            <div>{item.phoneNumber}</div>
                        </Space>
                    );
                });
                return <div>{phoneNumberList}</div>;
            },
        },
        {
            title: "Email",
            dataIndex: "emails",
            key: "emails",
            render: (emails) => {
                const emailList = emails.map((item) => {
                    return <div key={item.id}>{item.email}</div>;
                });
                return <div>{emailList}</div>;
            },
        },
        {
            title: "",
            dataIndex: "action",
            key: "action",
            render: (_, record) => (
                <>
                    <Button
                        danger
                        onClick={() => handleDeleteCustomer(record.id)}
                        style={{ marginRight: 5 }}
                    >
                        X??a
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => handleShowModal(record)}
                        style={{ marginBottom: 12 }}
                    >
                        S???a
                    </Button>
                    <Modal
                        title="C???p nh???t"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={[
                            <Button
                                key="back"
                                onClick={() => {
                                    handleCancel();
                                }}
                            >
                                Tr??? l???i
                            </Button>,
                            <Button
                                key="submit"
                                type="primary"
                                onClick={() => handleSubmitUpdate()}
                            >
                                C???p nh???t
                            </Button>,
                        ]}
                    >
                        <Form
                            name="updateCustomerForm"
                            form={updateCustomerForm}
                            labelCol={{
                                span: 6,
                            }}
                            wrapperCol={{
                                span: 18,
                            }}
                        >
                            <Form.Item label="T??n" name="name">
                                <Input />
                            </Form.Item>
                            <Form.Item label="S??? ??i???n tho???i" name="phoneNumber">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Email" name="email">
                                <Input />
                            </Form.Item>

                            <Card title="???nh s???n ph???m" className="card-item">
                                <Form.Item
                                    name="images"
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) => {
                                        console.log(e);
                                        if (Array.isArray(e)) {
                                            return e;
                                        }
                                        return e?.fileList;
                                    }}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "B???n ch??a t???i l??n ???nh s???n ph???m",
                                        },
                                    ]}
                                >
                                    <Upload
                                        listType="picture-card"
                                        beforeUpload={Upload.LIST_IGNORE}
                                    >
                                        <div>
                                            <PlusOutlined />
                                            <div
                                                style={{
                                                    marginTop: 8,
                                                }}
                                            >
                                                Upload
                                            </div>
                                        </div>
                                    </Upload>
                                </Form.Item>
                            </Card>
                        </Form>
                    </Modal>
                </>
            ),
        },
    ];
    return (
        <S.Wrapper>
            <Row>
                <Col
                    md={24}
                    style={{
                        color: "white",
                        backgroundColor: "#88AAB5",
                        height: 80,
                        padding: 16,
                    }}
                >
                    <h2>???ng d???ng qu???n l?? danh b??? ??i???n tho???i</h2>
                </Col>
                <Col md={24} style={{ marginTop: 12 }}>
                    <div style={{ marginBottom: 5 }}>T??m ki???m theo t??n</div>
                    <Input
                        onChange={(e) =>
                            handleFilter("keyword", e.target.value)
                        }
                        placeholder="T??m ki???m theo t??n"
                        value={filterParams.keyword}
                    />
                </Col>
                <Col
                    md={24}
                    style={{
                        marginTop: 16,
                        fontWeight: 500,
                        color: "#88AAB5",
                        fontSize: 20,
                    }}
                >
                    Danh s??ch
                </Col>
                <Col md={24} style={{ marginTop: 12 }}>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                    />
                </Col>
                <Col md={24} style={{ marginTop: 12 }}>
                    <Card title="Th??m m???i ng?????i d??ng">
                        <Form
                            name="createUserForm"
                            form={createUserForm}
                            labelCol={{
                                span: 6,
                            }}
                            wrapperCol={{
                                span: 10,
                            }}
                            onFinish={(values) => handleCreateProduct(values)}
                        >
                            <Form.Item
                                label="T??n"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "B???n ch??a nh???p t??n!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="S??? ??i???n tho???i"
                                name="phoneNumber"
                                rules={[
                                    {
                                        required: true,
                                        message: "B???n ch??a nh???p s??? ??i???n tho???i!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "B???n ch??a nh???p s??? ??i???n email!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Card title="???nh s???n ph???m" className="card-item">
                                <Form.Item
                                    name="images"
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) => {
                                        if (Array.isArray(e)) {
                                            return e;
                                        }
                                        return e?.fileList;
                                    }}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "B???n ch??a t???i l??n ???nh s???n ph???m",
                                        },
                                    ]}
                                >
                                    <Upload
                                        listType="picture-card"
                                        beforeUpload={Upload.LIST_IGNORE}
                                    >
                                        <div>
                                            <PlusOutlined />
                                            <div
                                                style={{
                                                    marginTop: 8,
                                                }}
                                            >
                                                Upload
                                            </div>
                                        </div>
                                    </Upload>
                                </Form.Item>
                            </Card>

                            <Form.Item
                                wrapperCol={{
                                    offset: 6,
                                    span: 10,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    T???o m???i
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </S.Wrapper>
    );
};

export default HomePage;
