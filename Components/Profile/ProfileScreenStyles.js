import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    view: {
        flexDirection:'column'
    },
    view_second: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin:5,
    },
    text_first: {
        margin:5,
        marginTop:8
    },
    view_third: {
        borderRadius: 4,
        borderWidth: 0.5
    },
    manualInsertion: {
        marginLeft:10,
        marginTop:20
    },
    place: {
        margin:10,
        borderRadius: 4,
        borderWidth: 0.5,
        marginRight:50,
        marginLeft:50,
    },
    sendContainer: {
        marginRight:50,
        marginLeft:50
    },
    view_fourth: {
        marginTop:20,
        borderRadius: 4,
        borderWidth: 0.5
    },
    scanQRCode: {
        marginLeft:10,
        marginTop:20
    },
    scan_container: {
        margin:20,
        marginRight:50,
        marginLeft:50,
        justifyContent:'flex-end'
    },
    view_fifth: {
        marginTop:20, 
        borderRadius: 4, 
        borderWidth: 0.5
    },
    emptyPlaces_container: {
        marginTop:20,
        marginLeft:50, 
        marginRight:50
    }

});