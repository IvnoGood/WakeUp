import { pick } from '@react-native-documents/picker'
//! does not load bc of the "Invariant Violation: TurboModuleRegistry.getEnforcing(...): 'RNDocumentPicker' could not be found. Verify that a module by this name is registered in the 
//! native binary., js engine: hermes" error
export default function TestPage() {
    return (
        <Button
            title="single file import"
            onPress={async () => {
                try {
                    const [pickResult] = await pick()
                    console.log(pickResult)
                } catch (error) {
                    console.error(error)
                }
            }}
        />
    )
}