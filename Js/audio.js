import * as Tone from 'tone';


// Test here to make sure it works
function audio_test()
{
  const synth = new Tone.Synth().toDestination();
  
  synth.triggerAttackRelease("C4", "8n");
}