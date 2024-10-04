import React, { useState, useEffect } from "react";
import {
    Document,
    Page,
    View,
    Text,
    Image,
    StyleSheet,
    PDFViewer,
} from "@react-pdf/renderer";
import axios from "axios";
import Cookies from "js-cookie";
// import QRCode from "qrcode";
import { QRCode } from "react-qrcode-logo";

const styles = StyleSheet.create({
    page: {
        padding: 10,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    section: {
        width: "100px",
        padding: 10,
        borderWidth: 1,
        borderRadius: "3px",
        borderColor: "#000",
        textAlign: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
    },
    qrCode: {
        width: "100%",
        height: "auto",
        marginBottom: "10px",
    },
    titleContainer: {
        borderRadius: "2px",
        width: "100%",
        paddingTop: "2px",
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        paddingBottom: "2px",
    },
    title: {
        fontSize: 8,
        color: "#000",
        fontWeight: "bold",
    },
    viewer: {
        width: "100%",
        height: "600px",
    },
});

function PreviewAllItemsPDF() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const inventoryToken = Cookies.get("inventory_token");

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/v1/items", {
                    headers: {
                        Authorization: `Bearer ${inventoryToken}`,
                    },
                    params: {
                        perPage: 20,
                    },
                });

                if (response.data.status === "success") {
                    const itemsWithQRCode = await Promise.all(
                        response.data.data.map(async (item) => {
                            const qrCodeDataUrl = await generateQRCodeDataURL(
                                item.id.toString()
                            );
                            return {
                                ...item,
                                qrCodeDataUrl,
                            };
                        })
                    );
                    setItems(itemsWithQRCode);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [inventoryToken]);

    const MyDocument = () => {
        const itemsPerPage = 20;
        const pages = [];

        for (let i = 0; i < items.length; i += itemsPerPage) {
            const pageItems = items.slice(i, i + itemsPerPage);
            pages.push(
                <Page key={i} size="A4" style={styles.page}>
                    {pageItems.map((item, index) => (
                        <View key={index} style={styles.section}>
                            <Image
                                src={item.qrCodeDataUrl}
                                style={styles.qrCode}
                            />{" "}
                            <View style={styles.titleContainer}>
                                <Text break style={styles.title}>
                                    {item.id_number}
                                </Text>
                            </View>
                        </View>
                    ))}
                </Page>
            );
        }

        return <Document>{pages}</Document>;
    };

    return (
        // <div>
        //     <QRCode
        //         value="https://github.com/gcoro/react-qrcode-logo"
        //         logoImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaUYBb12ClHCzGeuHXjhHy47f-nHpknbpsXQ&s"
        //         logoWidth="100px"
        //     />
        // </div>
        <PDFViewer style={styles.viewer}>
            <MyDocument />
        </PDFViewer>
    );
}

export default PreviewAllItemsPDF;

async function generateQRCodeDataURL(value) {
    try {
        const dataUrl = await QRCode.toDataURL(value, {
            errorCorrectionLevel: "H",
            margin: 0,
        });
        return dataUrl;
    } catch (error) {
        console.error("Error generating QR code:", error);
        return null;
    }
}
