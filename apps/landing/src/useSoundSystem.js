import { useState, useRef, useCallback } from 'react'
import * as Tone from 'tone'

export default function useSoundSystem() {
  const [soundEnabled, setSoundEnabled] = useState(false)
  const initialized = useRef(false)
  const oscRef      = useRef(null)

  const init = useCallback(async () => {
    if (initialized.current) return
    try {
      await Tone.start()
      initialized.current = true
      // Ambient subfrequency hum — fade in over 2s
      const osc = new Tone.Oscillator(55, 'sine')
      osc.volume.value = -80
      osc.toDestination()
      osc.start()
      osc.volume.rampTo(-40, 2)
      oscRef.current = osc
    } catch (e) {
      console.warn('[Sound] init failed', e)
    }
  }, [])

  const toggleSound = useCallback(async () => {
    if (!soundEnabled) {
      await init()
      if (oscRef.current) oscRef.current.volume.rampTo(-40, 1)
    } else {
      if (oscRef.current) oscRef.current.volume.rampTo(-80, 1)
    }
    setSoundEnabled(prev => !prev)
  }, [soundEnabled, init])

  const hoverCard = useCallback(async () => {
    if (!soundEnabled || !initialized.current) return
    try {
      const synth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope:   { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.3 },
      }).toDestination()
      synth.volume.value = -18
      synth.triggerAttackRelease('G4', '16n')
      setTimeout(() => synth.dispose(), 1000)
    } catch (e) {}
  }, [soundEnabled])

  const clickCard = useCallback(async () => {
    if (!soundEnabled || !initialized.current) return
    try {
      const synth = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope:   { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.4 },
      }).toDestination()
      synth.volume.value = -12
      const now = Tone.now()
      synth.triggerAttackRelease('C5', '16n', now)
      synth.triggerAttackRelease('E5', '16n', now + 0.08)
      synth.triggerAttackRelease('G5', '16n', now + 0.16)
      setTimeout(() => synth.dispose(), 1500)
    } catch (e) {}
  }, [soundEnabled])

  const blockPulse = useCallback(async () => {
    if (!soundEnabled || !initialized.current) return
    try {
      const synth = new Tone.MetalSynth().toDestination()
      synth.volume.value = -28
      synth.triggerAttackRelease('C2', '8n')
      setTimeout(() => synth.dispose(), 1000)
    } catch (e) {}
  }, [soundEnabled])

  return { soundEnabled, toggleSound, hoverCard, clickCard, blockPulse }
}
