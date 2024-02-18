import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { darkModeFontColor, lightModeFontColor } from "../utils/styles";
import {
  MidiInputContext,
  MidiOutputContext,
  ThemeContext,
} from "../pages/main";
import * as ColorUtils from "../utils/determineColors";
import { Input, Output, WebMidi } from "webmidi";

interface Props {
  label: string;
}
export default function MIDISetup({ label }: Props) {
  const { theme } = useContext(ThemeContext);
  const [availableMidiInputs, setAvailableMidiInputs] = useState<Input[]>([]);
  const [availableMidiOutputs, setAvailableMidiOutputs] = useState<Output[]>(
    []
  );
  const { setMidiInput, midiInput } = useContext(MidiInputContext);
  const { setMidiOutput, midiOutput } = useContext(MidiOutputContext);
  const midiInputRef = useRef<Input>(null);
  const midiOutputRef = useRef<Output>(null);

  useEffect(() => {
    if (WebMidi !== undefined) {
      WebMidi.addListener("connected", handleMidiSelects);
      WebMidi.addListener("disconnected", handleMidiSelects);

      handleMidiSelects();
    }
  }, []);

  const handleMidiSelects = () => {
    if (WebMidi.inputs.length === 0) {
      setAvailableMidiInputs([]);
      setMidiInput(null);

      WebMidi.inputs.map((input) => {
        input.removeListener("noteon");
        input.removeListener("noteoff");
        input.removeListener("midimessage");
      });
    } else {
      setAvailableMidiInputs(WebMidi.inputs);

      // User has disconnected selected midi input
      if (
        !WebMidi.inputs.includes(midiInputRef.current) &&
        midiInputRef.current !== null
      ) {
        WebMidi.inputs
          .filter((input) => input === midiInput)
          .map((input) => {
            input.removeListener("noteon");
            input.removeListener("noteoff");
            input.removeListener("midimessage");
          });

        setMidiInput(null);
        midiInputRef.current = null;
      }

      if (midiInput === null) {
        WebMidi.inputs.map((input) => {
          input.removeListener("noteon");
          input.removeListener("noteoff");
          input.removeListener("midimessage");
        });
      }
    }

    if (WebMidi.outputs.length === 0) {
      setAvailableMidiOutputs([]);
      setMidiOutput(null);
    } else {
      setAvailableMidiOutputs(WebMidi.outputs);

      if (
        !WebMidi.outputs.includes(midiOutputRef.current) &&
        midiOutputRef.current !== null
      ) {
        setMidiOutput(null);
        midiOutputRef.current = null;
      }
    }
  };

  const handleMidiInputSelection = (input: Input) => {
    if (midiInput !== null) {
      midiInput.removeListener("noteon");
      midiInput.removeListener("noteoff");
      midiInput.removeListener("midimessage");
    }

    setMidiInput(input);
    midiInputRef.current = input;
  };

  const handleMidiOutputSelection = (output: Output) => {
    setMidiOutput(output);
    midiOutputRef.current = output;
  };

  return (
    <Listbox>
      {({ open }) => (
        <>
          <Listbox.Label
            className="block text-sm font-medium leading-6"
            style={{
              color:
                theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
            }}
          >
            {label}
          </Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button
              className="relative cursor-pointer w-[100px] border-2 rounded-md py-1.5 pl-3 pr-3 text-left shadow-sm sm:text-sm sm:leading-6 focus:outline-none"
              style={{
                borderColor:
                  theme === "light-mode"
                    ? lightModeFontColor
                    : darkModeFontColor,
                backgroundColor: ColorUtils.determineBackgroundColor(),
                color:
                  theme === "light-mode"
                    ? lightModeFontColor
                    : darkModeFontColor,
              }}
            >
              <div className="w-[55px] overflow-x-scroll whitespace-nowrap no-scrollbar">
                <span
                  style={{
                    color:
                      theme === "light-mode"
                        ? lightModeFontColor
                        : darkModeFontColor,
                  }}
                >
                  {label.includes("Input")
                    ? midiInput !== null
                      ? midiInput.name
                      : "No midi input selected"
                    : midiOutput !== null
                    ? midiOutput.name
                    : "No midi output selected"}
                </span>
              </div>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className="absolute z-10 mt-1 max-h-60 overflow-auto w-[180px] rounded-md py-1 shadow-md border-2 ring-opacity-5 sm:text-sm focus:outline-none"
                style={{
                  borderColor:
                    theme === "light-mode"
                      ? lightModeFontColor
                      : darkModeFontColor,
                  backgroundColor: ColorUtils.determineBackgroundColor(),
                  color:
                    theme === "light-mode"
                      ? lightModeFontColor
                      : darkModeFontColor,
                }}
              >
                {label.includes("Input") &&
                  availableMidiInputs.map((availableMidiInput) => (
                    <Listbox.Option
                      key={availableMidiInput.id}
                      className="relative cursor-pointer select-none py-2 pl-3 pr-3 flex gap-[5px]"
                      value={availableMidiInput}
                      onClick={() =>
                        handleMidiInputSelection(availableMidiInput)
                      }
                    >
                      <>
                        <div className="w-[125px] overflow-x-scroll whitespace-nowrap no-scrollbar">
                          {availableMidiInput.name}
                        </div>

                        {availableMidiInput === midiInput ? (
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        ) : null}
                      </>
                    </Listbox.Option>
                  ))}
                {label.includes("Output") &&
                  availableMidiOutputs.map((availableMidiOutput) => (
                    <Listbox.Option
                      key={availableMidiOutput.id}
                      className="relative cursor-pointer select-none py-2 pl-3 pr-3 flex gap-[5px]"
                      value={midiOutput}
                      onClick={() =>
                        handleMidiOutputSelection(availableMidiOutput)
                      }
                    >
                      <>
                        <div className="w-[125px] overflow-x-scroll whitespace-nowrap no-scrollbar">
                          {availableMidiOutput.name}
                        </div>

                        {availableMidiOutput === midiOutput ? (
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        ) : null}
                      </>
                    </Listbox.Option>
                  ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
