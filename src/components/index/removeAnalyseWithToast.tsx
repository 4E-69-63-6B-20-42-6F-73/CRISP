import {
    Toast,
    ToastTitle,
    Link,
    useToastController,
    ToastTrigger,
} from "@fluentui/react-components";
import { useRemoveAnalyse } from "@/stores/ApplicationStore";

export const useRemoveAnalyseWithToast = () => {
    const removeAnalyse = useRemoveAnalyse();
    const { dispatchToast } = useToastController();

    const removeAnalyseWithToast = (id: number, name: string) => {
        console.log("Called!");
        const undo = removeAnalyse(id);

        dispatchToast(
            <Toast>
                <ToastTitle
                    action={
                        <ToastTrigger>
                            <Link onClick={undo}>Undo</Link>
                        </ToastTrigger>
                    }
                >
                    Removed {name}
                </ToastTitle>
            </Toast>,
            { intent: "success" },
        );
    };
    return removeAnalyseWithToast;
};
