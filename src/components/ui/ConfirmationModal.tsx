import React from 'react';
import { Modal, View, TouchableOpacity, Pressable } from 'react-native';
import { CText } from './CText';

type ConfirmationModalProps = {
        visible: boolean;
        title?: string;
        message?: string;
        confirmText?: string;
        cancelText?: string;
        onConfirm: () => void;
        onCancel: () => void;
        danger?: boolean;
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
        visible,
        title = 'Are you sure?',
        message = 'This action cannot be undone.',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        onConfirm,
        onCancel,
        danger = false,
}) => {
        return (
                <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
                        <Pressable onPress={onCancel} className="flex-1 items-center justify-center bg-black/60 p-6">
                                <View className="w-full max-w-md rounded-2xl bg-surfacePrimary p-4 dark:bg-surfacePrimary-dark">
                                        <View className="mb-3">
                                                <CText
                                                        size="lg"
                                                        weight="bold"
                                                        className="text-textPrimary dark:text-textPrimary-dark"
                                                >
                                                        {title}
                                                </CText>
                                        </View>
                                        <CText className="mb-4 text-sm text-textSecondary opacity-80 dark:text-textSecondary-dark">
                                                {message}
                                        </CText>
                                        <View className="my-3 flex-row justify-end gap-3">
                                                <TouchableOpacity
                                                        onPress={onCancel}
                                                        className="rounded-md bg-white/10 px-4 py-2"
                                                >
                                                        <CText className="text-textPrimary dark:text-textPrimary-dark">
                                                                {cancelText}
                                                        </CText>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                        onPress={onConfirm}
                                                        className={`rounded-md px-4 py-2 ${danger ? 'bg-status-error' : 'bg-primary'}`}
                                                >
                                                        <CText className="text-white">{confirmText}</CText>
                                                </TouchableOpacity>
                                        </View>
                                </View>
                        </Pressable>
                </Modal>
        );
};
