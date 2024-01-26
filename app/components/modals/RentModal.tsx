'use client';

import { useMemo, useState } from "react";
import Modal from "./Modal";
import useRentModal from "@/app/hooks/useRentModal";
import { categories } from "../navbar/Categories";
import Heading from "../Heading";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";

enum STEPS{
    CATEGORY=0,
    LOCATION=1,
    INFO=2,
    PHOTOS=3,
    DESCRIPTION=4,
    PRICE=5
}

const RentModal = () => {
    const rentModal = useRentModal();

    const [step, setStep] = useState(STEPS.CATEGORY);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            category: "",
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc:'',
            price:1,
            title:'',
            description:''
        }
    });
    
    const category = watch("category");
    const location = watch("location");

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true 
        })};

    const onBack = () => {
        setStep((value) => value - 1);
    };

    const onNext = () => {
        setStep((value) => value + 1);
    };

    const actionLabel = useMemo(() => {
        if(step === STEPS.PRICE){
            return "Oluştur";
        }
        return "İleri";
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if(step === STEPS.CATEGORY){
            return undefined;
        }
        return "Geri";
    }, [step]);

    let bodyContent = ( //değişken olduğu için let ile tanımladık
        <div className="flex flex-col gap-8">
            <Heading
              title="Hangisi Size daha uygun?"
              subtitle="Bir kategori seçin"
            />
            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-3
              max-h-[50vh]
              overflow-y-auto
            ">
                {categories.map((item) => (
                    <div key={item.label} className="col-span-1">
                        <CategoryInput
                          onClick={(category) => setCustomValue("category", category)}
                          selected={category === item.label}
                          label={item.label}
                          icon={item.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    if(step === STEPS.LOCATION){
        bodyContent=(
            <div className="flex flex-col gap-8">
                <Heading
                    title="Konumunuz nerede kalıyor?"
                    subtitle="Sizi bulmalarına yardım edin"
                />
                <CountrySelect
                  value={location}
                  onChange={(value) => setCustomValue("location", value)}
                />
            </div>
        )};

    return ( 
        <Modal
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={onNext}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            title="Airbnb senin evin"
            body={bodyContent}
        />
     );
}
 
export default RentModal;