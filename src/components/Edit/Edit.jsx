import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Select,
    Input,
    FormHelperText,
    useToast,
} from '@chakra-ui/react'
import axios from 'axios'

const API_URL = process.env.API_URL

const Edit = ({
    isOpen,
    onClose,
    selectedItems,
    entityType,
    endPointType,
    updateEndpoint,
    deleteEndpoint,
}) => {
    const [operation, setOperation] = useState('Update')
    const [field, setField] = useState('')
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const toast = useToast()

    const handleSave = async () => {
        if (operation === 'Update') {
            if (!field || !value) {
                setError('Please select a field and enter a value')
                return
            }

            setLoading(true)
            setError(null)

            try {
                const data = {
                    operation,
                    field,
                    value,
                    [endPointType]: selectedItems,
                }

                // Eğer entityType 'Accounts' veya 'Transactions' değilse, sent: false ekle
                if (
                    entityType !== 'Accounts' &&
                    entityType !== 'Transactions'
                ) {
                    data.sent = false
                }

                const response = await axios.post(
                    `${API_URL}/${updateEndpoint}`,
                    data
                )

                if (response.status === 200) {
                    toast({
                        title: 'Success!',
                        description: `${entityType} updated successfully.`,
                        status: 'success',
                        duration: 1000,
                        isClosable: true,
                        position: 'top-right',
                    })

                    setTimeout(() => {
                        window.location.reload()
                    }, 2000)
                }

                onClose()
            } catch (error) {
                console.error('Error saving changes:', error)
                setError('An error occurred while saving changes')
            } finally {
                setLoading(false)
            }
        } else if (operation === 'Delete') {
            setLoading(true)
            setError(null)

            try {
                const data = { [endPointType]: selectedItems }

                // Eğer entityType 'Accounts' veya 'Transactions' değilse, sent: false ekle
                if (
                    entityType !== 'Accounts' &&
                    entityType !== 'Transactions'
                ) {
                    data.sent = false
                }

                const response = await axios.post(
                    `${API_URL}/${deleteEndpoint}`,
                    data
                )

                if (response.status === 200) {
                    toast({
                        title: 'Success!',
                        description: `${entityType} deleted successfully.`,
                        status: 'success',
                        duration: 1000,
                        isClosable: true,
                        position: 'top-right',
                    })

                    setTimeout(() => {
                        window.location.reload()
                    }, 2000)
                }

                onClose()
            } catch (error) {
                console.error('Error deleting item:', error)
                setError('An error occurred while deleting the item')
            } finally {
                setLoading(false)
            }
        }
    }

    // Define the allowed fields
    const allowedFields =
        entityType === 'Accounts'
            ? ['type']
            : entityType === 'Transactions'
            ? ['amount', 'transactionType']
            : ['reportType', 'reportTitle']

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {operation} {selectedItems.length} {entityType}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Operation</FormLabel>
                        <Select
                            value={operation}
                            onChange={(e) => setOperation(e.target.value)}
                        >
                            <option value="Update">Update</option>
                            <option value="Delete">Delete</option>
                        </Select>
                    </FormControl>

                    {operation === 'Update' && (
                        <>
                            <FormControl mt={4}>
                                <FormLabel>Field</FormLabel>
                                <Select
                                    value={field}
                                    onChange={(e) => setField(e.target.value)}
                                >
                                    <option value="">Select a field</option>
                                    {allowedFields.map((key) => (
                                        <option key={key} value={key}>
                                            {key}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Value</FormLabel>
                                <Input
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                />
                                {error && (
                                    <FormHelperText color="red">
                                        {error}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={handleSave}
                        isLoading={loading}
                    >
                        Save
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default Edit
