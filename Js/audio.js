import * as Tone from 'tone';

_channels = [];
_synths = [];

// Test here to make sure it works
function audio_test()
{
  const synth = new Tone.Synth().toDestination();
  
  synth.triggerAttackRelease("C4", "8n");
}

function audio_init()
{
}

// This function should be at the end of your audio code
// and it should reference all synths or effects as it sends
// the audio to the speakers. Item is the variable reference to the
// synth or effect
function audio_to_master(item)
{
  item.toDestination();
}

function audio_add_channel()
{
  
}

/*
  Here we will keep all of the synth related functions
*/
// Add a new synthesizer to produce a tone
function audio_synth_add()
{
  var synth = new Tone.Synth();
  
  _synths.push(synth);
  
  return(synth);
}

function audio_synth_tone(synth, tone = "C4", attack = 0.25, release = "8n")
{
  synth.triggerAttackRelease(tone, attack, release);
}