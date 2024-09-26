import React from 'react';


const TextareaNoteSubscriber  = (props) => {
    const { register, label, error,disabled, id,validate, ...inputProps } = props
    return (
        <>
            {label ? (<label className='mb-1' htmlFor={id}><b>{label} <font className="text-[#f94a4a]">{validate}</font></b></label>):(<></>)}
            <textarea
                id={id}
                // rows="3.5"
                {...inputProps}
                disabled={disabled ? true  : false}
                className={`${
                    disabled && "bg-[#ededed] disabled:cursor-not-allowed "
                  } ${error && error?.message 
                    ? 'h-[120px] border-1 border-rose-500 rounded block w-full bg-transparent outline-none py-2 px-3'
                    : 'h-[120px] focus:ring-1 ring-inset focus:ring-[#2563eb] border-1 border-gray-300 rounded block w-full bg-transparent outline-none py-4 px-3'}`
                }
            />
            {error && error?.message && (
            <p className="flex mt-1 mb-1 text-red-500 text-xs text-left ">
                {error.message}
            </p>
            )}

        </>
    );
};

export default TextareaNoteSubscriber;