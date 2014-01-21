// returns an array (of 2 * 'pairs' entries) of shuffled indices into an array of 'length'
function choose_pairs(pairs, length) {
    var i, a = [], b = [];
    for(i = 0; i < length; i++) {
        a.push(i);
    }
    shuffle(a);
    for(i = 0; i < pairs; i++) {
        b.push(a[i]);
        b.push(a[i]);
    }
    shuffle(b);
    return b;
}

//Durstenfeld/Knuth
function shuffle(a) {
    var i, j, temp;
    for(i = (a.length - 1); i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
}

function help_dialog() {
    $('<div></div>')
    .html("You've come to the right place. Click the covers, find the yōkai demons and match the pairs...but beware! Yōkai are everywhere... ")
    .dialog({
        title: "Want to hunt some yōkai?",
        modal: true,
        buttons: { "Go!": function() { $(this).dialog("close"); } }
    });
}
    
function win_dialog(guesses) {
    $('<div></div>')
    .html("Nice hunting! You matched the yōkai in " + guesses + " guesses! But there are more yōkai to find. Are you up for another round?")
    .dialog({
        title: "Omedetō gozaimasu!",
        modal: true,
        buttons: { "Play again!": function() { $(this).dialog("close"); new game(6); } }
    });
}

function info_dialog(yi, after) {
    var y = yokai[yi];
    if (!y.seen) {
        y.seen = true;
        var hiragana = y.k == "" ? y.h : (" (" + y.h + ")");    // hiragana in brackets if there's kanji
        $('<div></div>')
        .html(y.k + hiragana + "<br>" + y.e + "<br><br>" + y.desc)
        .dialog({
            title: y.r,
            modal: true,
            close: after,
            buttons: { "Ok": function() { $(this).dialog("close"); } }
        });
    } else {
        after();
    }
}

function game(pairs) {
    this.pairs = pairs;
    this.guesses = 0;
    this.turn1 = this.turn2 = undefined;

    this.click = function($tile) {
        if (!$tile.hasClass("flipped")) {
            if (that.turn1 == undefined) {
                // first card
                $tile.addClass("flipped");
                this.turn1 = $tile;
            } else if (this.turn2 == undefined) {
                // second card
                var g = ++this.guesses,
                    yi = $tile.data("yokai");
                    
                $tile.addClass("flipped");
                if (yi === this.turn1.data("yokai")) {
                    // match!
                    var gameover = --this.pairs == 0
                    this.turn1 = undefined;
                    info_dialog(yi, gameover ? function() { win_dialog(g); } : function() {} );
                } else {
                    this.turn2 = $tile;
                }
            } else {
                // flip both cards back and turn the clicked card
                this.turn1.removeClass("flipped");
                this.turn2.removeClass("flipped");
                this.turn1 = this.turn2 = undefined;
                this.click($tile);
            }
        }
        return false;
    };
   
    var shuffled = choose_pairs(pairs, yokai.length);
    var $game = $("#game");
    $(".tile").remove();
    var that = this;
    $.each(shuffled, function(i, yi) {
        var $tile = $('<span class="tile">' +
            '<img width="200" height="260" class="back" src="' + covers[(i+Math.floor(i/4))%covers.length] + '">' +
            '<img width="200" height="260" class="face" src="' + yokai[yi].i + '" title="' + yokai[yi].r + '">' +
            '</span>');
        $game.append($tile);
        $tile.data("yokai", yi).click(function() { that.click($(this)); });
        if (plays++ == 0) {
            help_dialog();
        }
    });
}

var plays = 0,
covers=["TakeshitaDemons.jpg", "FilthLicker.jpg"],
yokai=[
{r:"Akaname", i:"SekienAkaname-crop.jpg", e:"Filth licker", k:"垢嘗", h:"あかなめ", desc:"Tasty! With frog-like skin, a long hairy tongue, and a fondness for slime, mould and rot, the akaname will lick your bathroom clean."},
{r:"Ama-no-zako", i:"SekienAmanozako-crop.jpg", e:"Heaven vs. everything", k:"天逆毎", h:"あまのざこ", desc:"Don't mess with this princess! Daughter of the storm god, she can fly for hundreds of miles without rest and can chew through swords."},
{r:"Ame-furi-kozo", i:"SekienAmefurikozo-crop.jpg", e:"Rain boy", k:"雨降り小僧", h:"あめふりこぞう", desc:"Wearing an umbrella instead of clothes, this little guy is a servant of the rain god. He loves to play in puddles and carries a lantern in case it gets dark."},
{r:"Amikiri", i:"SekienAmikiri-crop.jpg", e:"Net cutter", k:"網剪", h:"あみきり", desc:"Ever wonder why things get full of holes? This flying spirit sneaks out at night to snip through anything left lying around."},
{r:"Ao-nyōbō", i:"SekienAo-nyobo-crop.jpg", e:"Blue wife", k:"青女房", h:"あおにょうぼう", desc:"She spends a lot of time doing her makeup, but don't be fooled. The ao-nyōbō has blackened teeth and shaved eyebrows, and she likes to eat boys!"},
{r:"Biwa boku boku", i:"SekienBiwa-bokuboku-crop.jpg", e:"Haunted biwa", k:"琵琶牧々", h:"びわぼくぼく", desc:"Can you hear sad music in the distance? This demon is a lonely Japanese instrument that comes to life on its hundredth birthday. The biwa is a traditional string instrument, played by the Japanese goddess of luck: Benten."},
{r:"Bura-bura", i:"SekienBurabura-crop.jpg", e:"Haunted lantern", k:"不落々々", h:"ぶらぶら", desc:"Best friends with a haunted umbrella, the fire-breathing bura-bura is a paper lantern that comes to life when it turns 100 years old."},
{r:"Dorotabō", i:"SekienDorotabo-crop.jpg", e:"Muddy rice field ghost", k:"泥田坊", h:"どろたぼう", desc:"The ghost of a hard-working farmer who lost his land, this demon pops up from the mud to cry for his farm to be returned."},
{r:"Gaikotsu", i:"SekienGaikotsu-crop.jpg", e:"Skeleton", k:"骸骨", h:"がいこつ", desc:"This spooky skeleton was never properly buried, so it can never rest. It is doomed to walk the graveyard till its bones are buried."},
{r:"Hakutaku", i:"SekienHakutaku-crop.jpg", e:"White marsh", k:"白沢", h:"はくたく", desc:"Originally from China, this creature can bring good luck and prevent disease. A lion in China, the beast grew horns and hooves when it came to Japan."},
{r:"Hannya", i:"SekienHannya-crop.jpg", e:"Mask of youth", k:"般若", h:"はんにゃ", desc:"Ouch! This angry woman's face has been twisted by the souls of people gone crazy with jealousy."},
{r:"Hikeshibaba", i:"SekienHikeshibaba-crop.jpg", e:"Fire extinguishing woman", k:"火消婆", h:"ひけしばば", desc:"Keep your matches nearby... The hikeshibaba is a sneaky woman who loves to blow out lanterns and candles when you least expect it."},
{r:"Hitodama", i:"SekienHitodama-cropped.jpg", e:"Human souls", k:"人魂", h:"ひとだま", desc:"The spirit of a dying person, hitodama are fireballs that soar to the sky just before the person dies. When the balls fall back to earth, they splatter everything with slime. "},
{r:"Hone kara-kasa", i:"SekienHonekarakasa-crop.jpg", e:"Bone umbrella", k:"骨傘", h:"ほねからかさ", desc:"An old and unloved umbrella, this demon loves flying and blowing raspberries."},
{r:"Hone-onna", i:"SekienHoneonna-crop.jpg", e:"Bone woman", k:"骨女", h:"ほねおんな", desc:"Beware who you meet late at night... A skeleton disguised as a beautiful woman, the hone-onna survives by sucking the life force from her victims."},
{r:"Inu-gami", i:"SekienInugami-crop.jpg", e:"Dog god", k:"犬神", h:"いぬがみ", desc:"Take care of your pets! Inugami are dogs that have died a terrible death. Violent and aggressive spirits, they can possess humans and often turn against whoever created them."},
{r:"Itsumaden", i:"SekienItsumade-crop.jpg", e:"How long?", k:"以津真天", h:"いつまでん", desc:"A fire-breathing beast born from the spirits of unburied dead, this monster gets its name from its call: Until when? Until when?"},
{r:"Madara-gumo", i:"Sekien-jorogumo-crop.jpg", e:"Spotted spider", k:"斑蜘蛛", h:"まだらぐも", desc:"A poisonous spider that can take human form, this demon glows in the dark and spins a web as strong as rope."},
{r:"Kama itachi", i:"SekienKamaitachi-crop.jpg", e:"Sickle weasels", k:"鎌鼬", h:"かまいたち", desc:"Whirling with the winds and slicing through the night, the Sickle Weasels work in teams of three to slash at their enemies with blades that extend from their paws."},
{r:"Kappa", i:"SekienKappa-crop.jpg", e:"River imp", k:"河童", h:"かっぱ", desc:"Water-loving creatures who drink blood and eat cucumbers, kappa balance a water-filled dish on their head."},
{r:"Kawauso", i:"SekienKawauso-crop.jpg", e:"River otter", k:"川獺", h:"かわうそ", desc:"Known to steal the fish from fishermen's nets, the kawauso can take human form, although it speaks with an unusual accent."},
{r:"Kerakera-onna", i:"SekienKerakera-onna-crop.jpg", e:"Laughing lady", k:"倩兮女", h:"けらけらおんな", desc:"Every laughed so much you could cry? This demon is named for the sound of laughter (kerakera), and although she loves to make people laugh, her spooky cackle is more scary than funny."},
{r:"Keukegen", i:"SekienKeukegen-crop.jpg", e:"Fluffy hairy thing", k:"毛羽毛現", h:"けうけげん", desc:"Don't pat this one! A keukegen might look furry and cute, but it spreads disease and loves to live in the dark and the damp."},
{r:"Kitsune", i:"SekienKitsunebi-crop.jpg", e:"Fox", k:"狐", h:"きつね", desc:"Young kitsune look like ordinary foxes, but older kitsune can grow multiple tails and take human form. They can strike fire from the ground with their tails."},
{r:"Kyōkotsu", i:"SekienKyokotsu-crop.jpg", e:"Crazy bones", k:"狂骨", h:"きょうこつ", desc:"Steer clear of wells! Resentful and angry, the kyōkotsu never strays far from its well. Look down inside the well and you'll probably find its body."},
{r:"Makura-gaeshi", i:"SekienMakuragaeshi-crop.jpg", e:"Pillow replacer", k:"枕返し", h:"まくらがえし", desc:"Does your pillow fall out of bed at night? Beware that the makura-gaeshi doesn't replace it, because disaster will follow. This demon carries magical sand to put you to sleep."},
{r:"Mikoshi-nyūdō", i:"SekienMikoshi_niyudo-crop.jpg", e:"Growing monk", k:"見越入道", h:"みこしにゅうどう", desc:"If you meet this monk in the street, don't stare. The more you look, the taller he grows. Stare for too long and you will suddenly drop dead."},
{r:"Mokugyo daruma", i:"SekienMokugyo-daruma-crop.jpg", e:"Fish gong daruma", k:"木魚達磨", h:"もくぎょだるま", desc:"The mokugyo daruma is named for (and shaped like) a wooden fish gong, used to keep the rhythm of Buddhist chants."},
{r:"Mokumokuren", i:"SekienMokumokuren-crop.jpg", e:"Connected eyes", k:"目々連", h:"もくもくれん", desc:"Even the walls can have eyes! Battered Japanese shoji (paper sliding walls) can be haunted by dozens of eyeballs. If you stare at the eyes for too long, your own eyes will stop seeing."},
{r:"O-kubi", i:"sekienokubi-crop.jpg", e:"Big throat", k:"大首", h:"おおくび", desc:"If you're staring at the sky and spot an enormous head in the clouds, watch out! Spotting an o-kubi means something awful is just around the corner."},
{r:"Oni", i:"SekienOni-crop.jpg", e:"Ogre", k:"鬼", h:"おに", desc:"Famous for their mean looks and nasty personalities, oni are wild-living monsters with bad hair, rotten dress sense and spiky horns."},
{r:"Neko-mata", i:"SekienNekomata-crop.jpg", e:"Zombie cat", k:"猫又", h:"ねこまた", desc:"Huge, old and hungry, neko-mata are bloodthirsty cats with forked tails. They prefer to walk on their hind legs and can raise the dead."},
{r:"Ningyo", i:"SekienNingyo-crop.jpg", e:"Fish person", k:"人魚", h:"にんぎょ", desc:"A Japanese mermaid that cannot speak but can change into a human if it cries salty tears. If you eat a mermaid's flesh, you will live forever."},
{r:"Nue", i:"SekienNue-crop.jpg", e:"Nightmare rider", k:"鵺", h:"ぬえ", desc:"A monster with a monkey's head, a snake's tail, and a tiger's legs, the nue can ride on your nightmares and will make you sick. He makes a sound like the call of a mountain thrush."},
{r:"Nurarihyon", i:"SekienNurarihyon-crop.jpg", e:"Slippery Strange", k:"", h:"ぬらりひょん", desc:"Nurarihyon is the Grand Commander of all yōkai demons. He likes to drink tea and can unexpectedly drop in to visit any time."},
{r:"Nure-onna", i:"SekienNureonna-crop.jpg", e:"Woman of the Wet", k:"濡女", h:"ぬれおんな", desc:"With the head of a woman and the body of a snake, this fearsome creature has wicked claws and a forked tongue. She can crush a tree in the coils of her massive tail."},
{r:"Satori", i:"SekienSatori-crop.jpg", e:"Consciousness", k:"覚", h:"さとり", desc:"Have any embarrassing secrets? Watch out for this mean, monkey-like yōkai. It can read your mind and will speak your thoughts out loud."},
{r:"Sōgenbi", i:"SekienSogenbi-crop.jpg", e:"Fiery monk", k:"叢原火", h:"そうげんび", desc:"Crime doesn't pay! An oil-thief, this ghost must whirl through the air as a burning head."},
{r:"Tanuki", i:"SekienTanuki-crop.jpg", e:"Raccoon dog", k:"狸", h:"たぬき", desc:"Shape-shifting creatures who love money, food and wine, tanuki are famous for playing tricks. They'll try almost anything to get their way."},
{r:"Tengu", i:"SekienTengu-crop.jpg", e:"Heavenly dog", k:"天狗", h:"てんぐ", desc:"Half-human, half-bird, these spirits hatch from eggs and carry invisibility cloaks and nose-growing fans. Today the tengu's beak is often made into a long, thin nose."},
{r:"Tenjokudari", i:"SekienTenjokudari-crop.jpg", e:"Ceiling hanger", k:"天井下", h:"てんじょうくだり", desc:"Hairy and distorted, this spooky demon loves to drop down from the ceiling to scare you silly."},
{r:"Ubume", i:"SekienUbume-crop.jpg", e:"Woman who lost a child", k:"産女", h:"うぶめ", desc:"I feel sorry for this one! An ubume is the weeping ghost of a mother who can no longer care for her children."},
{r:"Ushi-oni", i:"SekienUshioni-crop.jpg", e:"Cow demon", k:"牛鬼", h:"うしおに", desc:"An ocean-dwelling people-eating creature that looks different depending on where in Japan it comes from."},
{r:"Ushiro-gami", i:"SekienUshirogami-crop.jpg", e:"Backwards god", k:"後神", h:"うしろがみ", desc:"Ever feel a tickle across the back of your neck? This hairy monster comes up from behind to drape its hair across you."},
{r:"Uwan", i:"SekienUwan-crop.jpg", e:"Disembodied voice", k:"", h:"うわん", desc:"Nothing to fear here: the uwan just makes a strange sound. It can be heard from inside an old building, but not from the outside."},
{r:"Yamauba", i:"SekienYamauba-crop.jpg", e:"Mountain hag", k:"山姥", h:"やまうば", desc:"Lost in the forest? Beware the yama-uba! She will offer to help, gain your trust, and then gobble you up!"},
{r:"Yuki-onna", i:"SekienYukionna-crop.jpg", e:"Snow Woman", k:"雪女", h:"ゆきおんな", desc:"Tall, pale and icy, this yōkai is a spirit of the snow. She leaves no footprints and can disappear in a puff of cold mist."},
{r:"Yūrei", i:"SekienYurei-crop.jpg", e:"Ghost", k:"幽霊", h:"ゆうれい", desc:"Yūrei are stuck on earth because their death was unjust or their body is unburied. When a yūrei is with you, you are unable to move."}];
