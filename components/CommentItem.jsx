import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { theme } from '../constants/theme';
import { hp } from '../helpers/common';
import Avatar from './Avatar';
import moment from 'moment';

const CommentItem = ({
    item,
    onDelete,
    highlight,
    canDelete,
}) => {
    const createdAt = moment(item?.created_at).format('MMM D');

    return (
        <TouchableOpacity
            style={[styles.container, highlight && styles.highlightedContainer]}
            onPress={() => {/* Handle comment press, if needed */}}
        >
            {/* Avatar */}
            <Avatar uri={item?.user?.image} size={hp(5)} />
            <View style={styles.nameTitle}>
                <Text style={styles.text}>
                    {item?.user?.name}
                </Text>
                <Text style={[styles.text, { color: theme.colors.textDark }]}>
                    {item.text}
                </Text>
            </View>
            <Text style={[styles.text, { color: theme.colors.textLight }]}>
                {createdAt}
            </Text>
            {/* Delete button */}
            {canDelete && (
                <TouchableOpacity onPress={() => onDelete(item)}>
                    <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

export default CommentItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        backgroundColor: 'white', // Default background color
        borderWidth: 0.5,
        borderColor: theme.colors.darkLight,
        padding: 15,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
    },
    highlightedContainer: {
        backgroundColor: 'white', // White background for highlighted comments
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Offset for shadow
        shadowOpacity: 0.3, // Shadow opacity
        shadowRadius: 4, // Shadow radius
        elevation: 5, // For Android shadow effect
        borderColor: theme.colors.white, // Optional: Change border color when highlighted
    },
    nameTitle: {
        flex: 1,
        gap: 2,
    },
    text: {
        fontSize: hp(1.6),
        fontWeight: theme.fonts.medium,
        color: theme.colors.text,
    },
    deleteText: {
        color: theme.colors.danger,
    }
});
