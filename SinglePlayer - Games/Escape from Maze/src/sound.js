

/* SfxrParams */
function SfxrParams(){this.setSettings=function(a){for(var b=0;b<24;b++)this[String.fromCharCode(97+b)]=a[b]||0;this.c<.01&&(this.c=.01);var c=this.b+this.c+this.e;if(c<.18){var d=.18/c;this.b*=d,this.c*=d,this.e*=d}}}function SfxrSynth(){this._params=new SfxrParams;var a,b,c,d,e,f,g,h,i,j,k,l;this.reset=function(){var a=this._params;d=100/(a.f*a.f+.001),e=100/(a.g*a.g+.001),f=1-a.h*a.h*a.h*.01,g=-a.i*a.i*a.i*1e-6,a.a||(k=.5-a.n/2,l=5e-5*-a.o),h=1+a.l*a.l*(a.l>0?-.9:10),i=0,j=1==a.m?0:(1-a.m)*(1-a.m)*2e4+32},this.totalReset=function(){this.reset();var d=this._params;return a=d.b*d.b*1e5,b=d.c*d.c*1e5,c=d.e*d.e*1e5+12,3*((a+b+c)/3|0)},this.synthWave=function(m,n){var o=this._params,p=1!=o.s||o.v,q=o.v*o.v*.1,r=1+3e-4*o.w,s=o.s*o.s*o.s*.1,t=1+1e-4*o.t,u=1!=o.s,v=o.x*o.x,w=o.g,x=o.q||o.r,y=o.r*o.r*o.r*.2,z=o.q*o.q*(o.q<0?-1020:1020),A=o.p?((1-o.p)*(1-o.p)*2e4|0)+32:0,B=o.d,C=o.j/2,D=o.k*o.k*.01,E=o.a,F=a,G=1/a,H=1/b,I=1/c,J=5/(1+o.u*o.u*20)*(.01+s);J>.8&&(J=.8),J=1-J;for(var Q,S,U,W,Y,Z,K=!1,L=0,M=0,N=0,O=0,P=0,R=0,T=0,V=0,X=0,$=0,_=new Array(1024),aa=new Array(32),ba=_.length;ba--;)_[ba]=0;for(var ba=aa.length;ba--;)aa[ba]=2*Math.random()-1;for(var ba=0;ba<n;ba++){if(K)return ba;if(A&&++X>=A&&(X=0,this.reset()),j&&++i>=j&&(j=0,d*=h),f+=g,d*=f,d>e&&(d=e,w>0&&(K=!0)),S=d,C>0&&($+=D,S*=1+Math.sin($)*C),S|=0,S<8&&(S=8),E||(k+=l,k<0?k=0:k>.5&&(k=.5)),++M>F)switch(M=0,++L){case 1:F=b;break;case 2:F=c}switch(L){case 0:N=M*G;break;case 1:N=1+2*(1-M*H)*B;break;case 2:N=1-M*I;break;case 3:N=0,K=!0}x&&(z+=y,U=0|z,U<0?U=-U:U>1023&&(U=1023)),p&&r&&(q*=r,q<1e-5?q=1e-5:q>.1&&(q=.1)),Z=0;for(var ca=8;ca--;){if(T++,T>=S&&(T%=S,3==E))for(var da=aa.length;da--;)aa[da]=2*Math.random()-1;switch(E){case 0:Y=T/S<k?.5:-.5;break;case 1:Y=1-T/S*2;break;case 2:W=T/S,W=6.28318531*(W>.5?W-1:W),Y=1.27323954*W+.405284735*W*W*(W<0?1:-1),Y=.225*((Y<0?-1:1)*Y*Y-Y)+Y;break;case 3:Y=aa[Math.abs(32*T/S|0)]}p&&(Q=R,s*=t,s<0?s=0:s>.1&&(s=.1),u?(P+=(Y-R)*s,P*=J):(R=Y,P=0),R+=P,O+=R-Q,O*=1-q,Y=O),x&&(_[V%1024]=Y,Y+=_[(V-U+1024)%1024],V++),Z+=Y}Z*=.125*N*v,m[ba]=Z>=1?32767:Z<=-1?-32768:32767*Z|0}return n}}var synth=new SfxrSynth;window.jsfxr=function(a){synth._params.setSettings(a);var b=synth.totalReset(),c=new Uint8Array(4*((b+1)/2|0)+44),d=2*synth.synthWave(new Uint16Array(c.buffer,44),b),e=new Uint32Array(c.buffer,0,44);e[0]=1179011410,e[1]=d+36,e[2]=1163280727,e[3]=544501094,e[4]=16,e[5]=65537,e[6]=44100,e[7]=88200,e[8]=1048578,e[9]=1635017060,e[10]=d,d+=44;for(var f=0,g="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",h="data:audio/wav;base64,";f<d;f+=3){var i=c[f]<<16|c[f+1]<<8|c[f+2];h+=g[i>>18]+g[i>>12&63]+g[i>>6&63]+g[63&i]}return h};
 
class Sound{

    tglMute(){
      this.mute = !this.mute;
    }
 
  hit(){
    Snd._play([1,,0.0246,,0.1553,0.5731,,-0.6532,,,,,,,,,,,1,,,0.0082,,0.32]);
  }

  start(){
    Snd._play([1,,0.1254,,0.288,0.73,,0.06,,0.3725,0.0526,,,,,,,,0.89,-0.56,,,-0.76,0.71]);
  }

  enter(){
    Snd._play([1,0.0045,0.9759,0.0426,0.9729,0.8504,,,-0.0021,-0.0301,-0.2691,-0.876,0.3828,0.8763,-0.0121,-0.2677,0.0074,-0.0004,0.7604,-0.265,-0.4473,0.0048,,0.49]);
  }

  glitch(){
    Snd._play([3,1,0.01,,0.221,0.23,,-0.64,-0.42,,,0.1399,,0.1209,,,-0.76,-0.86,0.5141,,,,,0.71]);
  }

 end(){
   Snd._play([2,0.0058,0.385,0.1384,0.4848,0.5559,,-0.0009,,,0.4078,-0.1889,,0.3744,-0.015,0.0006,,-0.0007,0.996,0.1962,,0.3422,-0.0003,0.256]);
  }

   _play(snd){
      if(this.mute) return;
      var player = new Audio();
      player.src =  jsfxr(snd);
      player.play();
  }

}

const Snd = new Sound();