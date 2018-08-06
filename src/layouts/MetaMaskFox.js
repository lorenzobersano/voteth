import React from 'react';
import styled from 'styled-components';

import chromeBadge from '../img/chromeAddon.png';
import firefoxBadge from '../img/firefoxAddon.png';

const FoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
`;

const DownloadAddonBadge = styled.img`
  margin: 0 0.5rem 0 0.5rem;
  width: 129px;
  height: 45px;
`;

export default props => (
  <FoxContainer>
    <svg width="349px" height="188px">
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="185.42813892662525,52.542889058589935 163.57186107337475,52.542889058589935 154.94776309654117,32.78058338165283"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="154.94776309654117,32.78058338165283 194.05223690345883,32.78058338165283 185.42813892662525,52.542889058589935"
      />
      <polygon
        fill="rgb(228,118,27)"
        stroke="rgb(228,118,27)"
        points="163.57186107337475,52.542889058589935 108.87104339897633,11.163607120513916 154.94776309654117,32.78058338165283"
      />
      <polygon
        fill="rgb(226,118,27)"
        stroke="rgb(226,118,27)"
        points="240.12895660102367,11.163607120513916 185.42813892662525,52.542889058589935 194.05223690345883,32.78058338165283"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="130.611381188035,70.60925531387329 105.67541612684727,63.78954142332077 104.38281494379044,57.994367837905884"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="218.388618811965,70.60925531387329 244.61718505620956,57.994367837905884 243.32458387315273,63.78954142332077"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="106.47425013780594,70.75117236375809 105.67541612684727,63.78954142332077 130.611381188035,70.60925531387329"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="242.52574986219406,70.75117236375809 218.388618811965,70.60925531387329 243.32458387315273,63.78954142332077"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="109.89609418809414,80.86066600680351 130.611381188035,70.60925531387329 141.40404435247183,72.2873272895813"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="106.47425013780594,70.75117236375809 130.611381188035,70.60925531387329 109.89609418809414,80.86066600680351"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="239.10390581190586,80.86066600680351 207.59595564752817,72.2873272895813 218.388618811965,70.60925531387329"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="242.52574986219406,70.75117236375809 239.10390581190586,80.86066600680351 218.388618811965,70.60925531387329"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="131.95568059384823,38.66787600517273 130.611381188035,70.60925531387329 104.38281494379044,57.994367837905884"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="141.40404435247183,72.2873272895813 130.611381188035,70.60925531387329 131.95568059384823,38.66787600517273"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="244.61718505620956,57.994367837905884 218.388618811965,70.60925531387329 217.04431940615177,38.66787600517273"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="217.04431940615177,38.66787600517273 218.388618811965,70.60925531387329 207.59595564752817,72.2873272895813"
      />
      <polygon
        fill="rgb(226,118,27)"
        stroke="rgb(226,118,27)"
        points="141.8621126562357,136.52614057064056 150.03143034875393,132.67840653657913 151.39090482890606,132.75028812885284"
      />
      <polygon
        fill="rgb(226,118,27)"
        stroke="rgb(226,118,27)"
        points="197.60909517109394,132.75028812885284 198.96856965124607,132.67840653657913 207.1378873437643,136.52614057064056"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="101.1122015863657,60.033495008945465 104.38281494379044,57.994367837905884 105.67541612684727,63.78954142332077"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="247.8877984136343,60.033495008945465 243.32458387315273,63.78954142332077 244.61718505620956,57.994367837905884"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="131.95568059384823,38.66787600517273 163.57186107337475,52.542889058589935 141.40404435247183,72.2873272895813"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="207.59595564752817,72.2873272895813 185.42813892662525,52.542889058589935 217.04431940615177,38.66787600517273"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="106.47425013780594,70.75117236375809 101.96173012256622,66.27384477853775 105.67541612684727,63.78954142332077"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="242.52574986219406,70.75117236375809 243.32458387315273,63.78954142332077 247.03826987743378,66.27384477853775"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="104.38281494379044,57.994367837905884 100.60797099769115,33.6089403629303 131.95568059384823,38.66787600517273"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="217.04431940615177,38.66787600517273 248.39202900230885,33.6089403629303 244.61718505620956,57.994367837905884"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="109.89609418809414,80.86066600680351 103.43443520367146,72.64261016249657 106.47425013780594,70.75117236375809"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="239.10390581190586,80.86066600680351 242.52574986219406,70.75117236375809 245.56556479632854,72.64261016249657"
      />
      <polygon
        fill="rgb(228,118,27)"
        stroke="rgb(228,118,27)"
        points="141.8621126562357,136.52614057064056 106.15066429972649,150.47262060642242 97.8224243670702,114.81868410110474"
      />
      <polygon
        fill="rgb(228,118,27)"
        stroke="rgb(228,118,27)"
        points="251.1775756329298,114.81868410110474 242.8493357002735,150.47262060642242 207.1378873437643,136.52614057064056"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="131.68602139502764,82.41166844964027 97.8224243670702,114.81868410110474 109.89609418809414,80.86066600680351"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="217.31397860497236,82.41166844964027 239.10390581190586,80.86066600680351 251.1775756329298,114.81868410110474"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="109.89609418809414,80.86066600680351 141.40404435247183,72.2873272895813 131.68602139502764,82.41166844964027"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="239.10390581190586,80.86066600680351 217.31397860497236,82.41166844964027 207.59595564752817,72.2873272895813"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="126.28011958301067,109.73077338933945 97.8224243670702,114.81868410110474 131.68602139502764,82.41166844964027"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="217.31397860497236,82.41166844964027 251.1775756329298,114.81868410110474 222.71988041698933,109.73077338933945"
      />
      <polygon
        fill="rgb(228,118,27)"
        stroke="rgb(228,118,27)"
        points="97.8224243670702,114.81868410110474 126.28011958301067,109.73077338933945 141.8621126562357,136.52614057064056"
      />
      <polygon
        fill="rgb(228,118,27)"
        stroke="rgb(228,118,27)"
        points="207.1378873437643,136.52614057064056 222.71988041698933,109.73077338933945 251.1775756329298,114.81868410110474"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="108.87104339897633,11.163607120513916 163.57186107337475,52.542889058589935 131.95568059384823,38.66787600517273"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="240.12895660102367,11.163607120513916 248.39202900230885,33.6089403629303 217.04431940615177,38.66787600517273"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="131.95568059384823,38.66787600517273 100.60797099769115,33.6089403629303 108.87104339897633,11.163607120513916"
      />
      <polygon
        fill="rgb(118,61,22)"
        stroke="rgb(118,61,22)"
        points="217.04431940615177,38.66787600517273 185.42813892662525,52.542889058589935 240.12895660102367,11.163607120513916"
      />
      <polygon
        fill="rgb(228,118,27)"
        stroke="rgb(228,118,27)"
        points="141.40404435247183,72.2873272895813 163.57186107337475,52.542889058589935 165.35106963291764,82.30038560926914"
      />
      <polygon
        fill="rgb(228,118,27)"
        stroke="rgb(228,118,27)"
        points="165.35106963291764,82.30038560926914 131.68602139502764,82.41166844964027 141.40404435247183,72.2873272895813"
      />
      <polygon
        fill="rgb(228,118,27)"
        stroke="rgb(228,118,27)"
        points="207.59595564752817,72.2873272895813 217.31397860497236,82.41166844964027 183.64893036708236,82.30038560926914"
      />
      <polygon
        fill="rgb(228,118,27)"
        stroke="rgb(228,118,27)"
        points="183.64893036708236,82.30038560926914 185.42813892662525,52.542889058589935 207.59595564752817,72.2873272895813"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="163.57186107337475,52.542889058589935 185.42813892662525,52.542889058589935 183.64893036708236,82.30038560926914"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="183.64893036708236,82.30038560926914 165.35106963291764,82.30038560926914 163.57186107337475,52.542889058589935"
      />
      <polygon
        fill="rgb(205,97,22)"
        stroke="rgb(205,97,22)"
        points="141.8621126562357,136.52614057064056 126.28011958301067,109.73077338933945 145.2881249114871,108.54516273736954"
      />
      <polygon
        fill="rgb(205,97,22)"
        stroke="rgb(205,97,22)"
        points="207.1378873437643,136.52614057064056 203.7118750885129,108.54516273736954 222.71988041698933,109.73077338933945"
      />
      <polygon
        fill="rgb(205,97,22)"
        stroke="rgb(205,97,22)"
        points="145.0426792651415,95.11824004352093 131.68602139502764,82.41166844964027 165.35106963291764,82.30038560926914"
      />
      <polygon
        fill="rgb(205,97,22)"
        stroke="rgb(205,97,22)"
        points="183.64893036708236,82.30038560926914 217.31397860497236,82.41166844964027 203.9573207348585,95.11824004352093"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="131.68602139502764,82.41166844964027 145.2881249114871,108.54516273736954 126.28011958301067,109.73077338933945"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="222.71988041698933,109.73077338933945 203.7118750885129,108.54516273736954 217.31397860497236,82.41166844964027"
      />
      <polygon
        fill="rgb(228,117,31)"
        stroke="rgb(228,117,31)"
        points="131.68602139502764,82.41166844964027 145.0426792651415,95.11824004352093 145.2881249114871,108.54516273736954"
      />
      <polygon
        fill="rgb(228,117,31)"
        stroke="rgb(228,117,31)"
        points="217.31397860497236,82.41166844964027 203.7118750885129,108.54516273736954 203.9573207348585,95.11824004352093"
      />
      <polygon
        fill="rgb(192,173,158)"
        stroke="rgb(192,173,158)"
        points="148.61055090278387,139.94656026363373 141.8621126562357,136.52614057064056 161.4093635752797,135.9092514514923"
      />
      <polygon
        fill="rgb(192,173,158)"
        stroke="rgb(192,173,158)"
        points="187.5906364247203,135.9092514514923 207.1378873437643,136.52614057064056 200.38944909721613,139.94656026363373"
      />
      <polygon
        fill="rgb(205,97,22)"
        stroke="rgb(205,97,22)"
        points="165.35106963291764,82.30038560926914 157.17731200903654,89.45428664237261 145.0426792651415,95.11824004352093"
      />
      <polygon
        fill="rgb(205,97,22)"
        stroke="rgb(205,97,22)"
        points="203.9573207348585,95.11824004352093 191.82268799096346,89.45428664237261 183.64893036708236,82.30038560926914"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="145.2881249114871,108.54516273736954 145.0426792651415,95.11824004352093 162.11238867789507,99.00559488683939"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="203.7118750885129,108.54516273736954 186.88761132210493,99.00559488683939 203.9573207348585,95.11824004352093"
      />
      <polygon
        fill="rgb(35,52,71)"
        stroke="rgb(35,52,71)"
        points="162.11238867789507,99.00559488683939 145.0426792651415,95.11824004352093 157.17731200903654,89.45428664237261"
      />
      <polygon
        fill="rgb(35,52,71)"
        stroke="rgb(35,52,71)"
        points="186.88761132210493,99.00559488683939 191.82268799096346,89.45428664237261 203.9573207348585,95.11824004352093"
      />
      <polygon
        fill="rgb(228,118,27)"
        stroke="rgb(228,118,27)"
        points="163.0414498411119,113.7130357325077 141.8621126562357,136.52614057064056 145.2881249114871,108.54516273736954"
      />
      <polygon
        fill="rgb(228,118,27)"
        stroke="rgb(228,118,27)"
        points="185.9585501588881,113.7130357325077 203.7118750885129,108.54516273736954 207.1378873437643,136.52614057064056"
      />
      <polygon
        fill="rgb(205,97,22)"
        stroke="rgb(205,97,22)"
        points="157.17731200903654,89.45428664237261 165.35106963291764,82.30038560926914 162.11238867789507,99.00559488683939"
      />
      <polygon
        fill="rgb(205,97,22)"
        stroke="rgb(205,97,22)"
        points="191.82268799096346,89.45428664237261 186.88761132210493,99.00559488683939 183.64893036708236,82.30038560926914"
      />
      <polygon
        fill="rgb(215,193,179)"
        stroke="rgb(215,193,179)"
        points="161.30375821515918,127.92508041858673 161.4093635752797,135.9092514514923 141.8621126562357,136.52614057064056"
      />
      <polygon
        fill="rgb(215,193,179)"
        stroke="rgb(215,193,179)"
        points="141.8621126562357,136.52614057064056 163.0414498411119,113.7130357325077 161.30375821515918,127.92508041858673"
      />
      <polygon
        fill="rgb(215,193,179)"
        stroke="rgb(215,193,179)"
        points="187.69624178484082,127.92508041858673 207.1378873437643,136.52614057064056 187.5906364247203,135.9092514514923"
      />
      <polygon
        fill="rgb(215,193,179)"
        stroke="rgb(215,193,179)"
        points="207.1378873437643,136.52614057064056 187.69624178484082,127.92508041858673 185.9585501588881,113.7130357325077"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="166.06301230192184,91.66777321323752 165.35106963291764,82.30038560926914 183.64893036708236,82.30038560926914"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="183.64893036708236,82.30038560926914 182.93698769807816,91.66777321323752 166.06301230192184,91.66777321323752"
      />
      <polygon
        fill="rgb(228,117,31)"
        stroke="rgb(228,117,31)"
        points="162.11238867789507,99.00559488683939 165.35106963291764,82.30038560926914 166.06301230192184,91.66777321323752"
      />
      <polygon
        fill="rgb(226,118,27)"
        stroke="rgb(226,118,27)"
        points="186.88761132210493,99.00559488683939 182.93698769807816,91.66777321323752 183.64893036708236,82.30038560926914"
      />
      <polygon
        fill="rgb(192,173,158)"
        stroke="rgb(192,173,158)"
        points="161.4093635752797,135.9092514514923 162.5356526002288,141.57743394374847 148.61055090278387,139.94656026363373"
      />
      <polygon
        fill="rgb(192,173,158)"
        stroke="rgb(192,173,158)"
        points="200.38944909721613,139.94656026363373 186.4643473997712,141.57743394374847 187.5906364247203,135.9092514514923"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="163.0414498411119,113.7130357325077 145.2881249114871,108.54516273736954 162.11238867789507,99.00559488683939"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="186.88761132210493,99.00559488683939 203.7118750885129,108.54516273736954 185.9585501588881,113.7130357325077"
      />
      <polygon
        fill="rgb(228,117,31)"
        stroke="rgb(228,117,31)"
        points="166.06301230192184,91.66777321323752 166.00309598073363,111.65474545955658 162.11238867789507,99.00559488683939"
      />
      <polygon
        fill="rgb(228,117,31)"
        stroke="rgb(228,117,31)"
        points="182.93698769807816,91.66777321323752 186.88761132210493,99.00559488683939 182.99690401926637,111.65474545955658"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="162.11238867789507,99.00559488683939 166.00309598073363,111.65474545955658 163.0414498411119,113.7130357325077"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="185.9585501588881,113.7130357325077 182.99690401926637,111.65474545955658 186.88761132210493,99.00559488683939"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="166.06301230192184,91.66777321323752 182.93698769807816,91.66777321323752 182.99690401926637,111.65474545955658"
      />
      <polygon
        fill="rgb(246,133,27)"
        stroke="rgb(246,133,27)"
        points="182.99690401926637,111.65474545955658 166.00309598073363,111.65474545955658 166.06301230192184,91.66777321323752"
      />
      <polygon
        fill="rgb(192,173,158)"
        stroke="rgb(192,173,158)"
        points="162.5356526002288,141.57743394374847 161.4093635752797,135.9092514514923 161.30375821515918,127.92508041858673"
      />
      <polygon
        fill="rgb(192,173,158)"
        stroke="rgb(192,173,158)"
        points="187.69624178484082,127.92508041858673 187.5906364247203,135.9092514514923 186.4643473997712,141.57743394374847"
      />
      <polygon
        fill="rgb(192,173,158)"
        stroke="rgb(192,173,158)"
        points="161.30375821515918,127.92508041858673 162.84266962856054,125.53212851285934 162.5356526002288,141.57743394374847"
      />
      <polygon
        fill="rgb(192,173,158)"
        stroke="rgb(192,173,158)"
        points="162.5356526002288,141.57743394374847 162.84266962856054,125.53212851285934 186.15733037143946,125.53212851285934"
      />
      <polygon
        fill="rgb(192,173,158)"
        stroke="rgb(192,173,158)"
        points="186.15733037143946,125.53212851285934 186.4643473997712,141.57743394374847 162.5356526002288,141.57743394374847"
      />
      <polygon
        fill="rgb(192,173,158)"
        stroke="rgb(192,173,158)"
        points="186.4643473997712,141.57743394374847 186.15733037143946,125.53212851285934 187.69624178484082,127.92508041858673"
      />
      <polygon
        fill="rgb(22,22,22)"
        stroke="rgb(22,22,22)"
        points="162.84266962856054,125.53212851285934 161.30375821515918,127.92508041858673 163.0414498411119,113.7130357325077"
      />
      <polygon
        fill="rgb(22,22,22)"
        stroke="rgb(22,22,22)"
        points="185.9585501588881,113.7130357325077 187.69624178484082,127.92508041858673 186.15733037143946,125.53212851285934"
      />
      <polygon
        fill="rgb(22,22,22)"
        stroke="rgb(22,22,22)"
        points="165.8385084401816,112.56075775623322 166.00309598073363,111.65474545955658 182.99690401926637,111.65474545955658"
      />
      <polygon
        fill="rgb(22,22,22)"
        stroke="rgb(22,22,22)"
        points="182.99690401926637,111.65474545955658 183.1614915598184,112.56075775623322 165.8385084401816,112.56075775623322"
      />
      <polygon
        fill="rgb(22,22,22)"
        stroke="rgb(22,22,22)"
        points="163.0414498411119,113.7130357325077 166.00309598073363,111.65474545955658 165.8385084401816,112.56075775623322"
      />
      <polygon
        fill="rgb(22,22,22)"
        stroke="rgb(22,22,22)"
        points="183.1614915598184,112.56075775623322 182.99690401926637,111.65474545955658 185.9585501588881,113.7130357325077"
      />
      <polygon
        fill="rgb(22,22,22)"
        stroke="rgb(22,22,22)"
        points="163.0414498411119,113.7130357325077 163.94063410162926,114.69618648290634 162.84266962856054,125.53212851285934"
      />
      <polygon
        fill="rgb(22,22,22)"
        stroke="rgb(22,22,22)"
        points="165.8385084401816,112.56075775623322 163.94063410162926,114.69618648290634 163.0414498411119,113.7130357325077"
      />
      <polygon
        fill="rgb(22,22,22)"
        stroke="rgb(22,22,22)"
        points="186.15733037143946,125.53212851285934 185.05936589837074,114.69618648290634 185.9585501588881,113.7130357325077"
      />
      <polygon
        fill="rgb(22,22,22)"
        stroke="rgb(22,22,22)"
        points="185.9585501588881,113.7130357325077 185.05936589837074,114.69618648290634 183.1614915598184,112.56075775623322"
      />
      <polygon
        fill="rgb(22,22,22)"
        stroke="rgb(22,22,22)"
        points="163.94063410162926,114.69618648290634 185.05936589837074,114.69618648290634 186.15733037143946,125.53212851285934"
      />
      <polygon
        fill="rgb(22,22,22)"
        stroke="rgb(22,22,22)"
        points="186.15733037143946,125.53212851285934 162.84266962856054,125.53212851285934 163.94063410162926,114.69618648290634"
      />
      <polygon
        fill="rgb(22,22,22)"
        stroke="rgb(22,22,22)"
        points="183.1614915598184,112.56075775623322 185.05936589837074,114.69618648290634 163.94063410162926,114.69618648290634"
      />
      <polygon
        fill="rgb(22,22,22)"
        stroke="rgb(22,22,22)"
        points="163.94063410162926,114.69618648290634 165.8385084401816,112.56075775623322 183.1614915598184,112.56075775623322"
      />
    </svg>
    <h2>
      Please {props.toDownload ? 'download' : 'unlock'} MetaMask to interact
      with votΞ
    </h2>
    {props.toDownload && (
      <div>
        <DownloadAddonBadge
          src={chromeBadge}
          onClick={() =>
            window.open(
              'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
              '_blank'
            )
          }
        />
        <DownloadAddonBadge
          src={firefoxBadge}
          onClick={() =>
            window.open(
              'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
              '_blank'
            )
          }
        />
      </div>
    )}
  </FoxContainer>
);