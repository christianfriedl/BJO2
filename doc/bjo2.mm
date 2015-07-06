<map version="freeplane 1.3.0">
<!--To view this file, download free mind mapping software Freeplane from http://freeplane.sourceforge.net -->
<node TEXT="BJO in JS" FOLDED="false" ID="ID_1723255651" CREATED="1283093380553" MODIFIED="1426860234514"><hook NAME="MapStyle">

<map_styles>
<stylenode LOCALIZED_TEXT="styles.root_node">
<stylenode LOCALIZED_TEXT="styles.predefined" POSITION="right">
<stylenode LOCALIZED_TEXT="default" MAX_WIDTH="600" COLOR="#000000" STYLE="as_parent">
<font NAME="SansSerif" SIZE="10" BOLD="false" ITALIC="false"/>
</stylenode>
<stylenode LOCALIZED_TEXT="defaultstyle.details"/>
<stylenode LOCALIZED_TEXT="defaultstyle.note"/>
<stylenode LOCALIZED_TEXT="defaultstyle.floating">
<edge STYLE="hide_edge"/>
<cloud COLOR="#f0f0f0" SHAPE="ROUND_RECT"/>
</stylenode>
</stylenode>
<stylenode LOCALIZED_TEXT="styles.user-defined" POSITION="right">
<stylenode LOCALIZED_TEXT="styles.topic" COLOR="#18898b" STYLE="fork">
<font NAME="Liberation Sans" SIZE="10" BOLD="true"/>
</stylenode>
<stylenode LOCALIZED_TEXT="styles.subtopic" COLOR="#cc3300" STYLE="fork">
<font NAME="Liberation Sans" SIZE="10" BOLD="true"/>
</stylenode>
<stylenode LOCALIZED_TEXT="styles.subsubtopic" COLOR="#669900">
<font NAME="Liberation Sans" SIZE="10" BOLD="true"/>
</stylenode>
<stylenode LOCALIZED_TEXT="styles.important">
<icon BUILTIN="yes"/>
</stylenode>
</stylenode>
<stylenode LOCALIZED_TEXT="styles.AutomaticLayout" POSITION="right">
<stylenode LOCALIZED_TEXT="AutomaticLayout.level.root" COLOR="#000000">
<font SIZE="18"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,1" COLOR="#0033ff">
<font SIZE="16"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,2" COLOR="#00b439">
<font SIZE="14"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,3" COLOR="#990000">
<font SIZE="12"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,4" COLOR="#111111">
<font SIZE="10"/>
</stylenode>
</stylenode>
</stylenode>
</map_styles>
</hook>
<hook NAME="AutomaticEdgeColor" COUNTER="7"/>
<node TEXT="&quot;BJO v.2&quot;" POSITION="right" ID="ID_28794418" CREATED="1426860351617" MODIFIED="1426860356034">
<edge COLOR="#ff00ff"/>
</node>
<node TEXT="Client" POSITION="right" ID="ID_71224373" CREATED="1426860235091" MODIFIED="1426860239211">
<edge COLOR="#ff0000"/>
<node TEXT="Node?" ID="ID_1913239834" CREATED="1426860239623" MODIFIED="1426860244082"/>
</node>
<node TEXT="Server" POSITION="right" ID="ID_1263539102" CREATED="1426860245235" MODIFIED="1426860246563">
<edge COLOR="#0000ff"/>
<node TEXT="Node?" ID="ID_282683585" CREATED="1426860246943" MODIFIED="1426860248118"/>
<node TEXT="transactional" ID="ID_285528198" CREATED="1426860502310" MODIFIED="1426860510878"/>
<node TEXT="all in sql?" ID="ID_51335204" CREATED="1426860519519" MODIFIED="1426860536589"/>
<node TEXT="how to model references" ID="ID_1518640490" CREATED="1426860536911" MODIFIED="1426860561058"/>
<node TEXT="sqlite backend?" ID="ID_748504985" CREATED="1426861989206" MODIFIED="1426861991566"/>
</node>
<node TEXT="Transport" POSITION="right" ID="ID_1864574725" CREATED="1426860278599" MODIFIED="1426860280787">
<edge COLOR="#00ff00"/>
<node TEXT="Json" ID="ID_19095344" CREATED="1426860281245" MODIFIED="1426860282448"/>
</node>
<node TEXT="Scrum" POSITION="right" ID="ID_1919369938" CREATED="1435663658673" MODIFIED="1435663661271">
<edge COLOR="#7c0000"/>
<node TEXT="Todo" ID="ID_423863443" CREATED="1430315737368" MODIFIED="1435663662175">
<node TEXT="Prio 1" ID="ID_1488675716" CREATED="1435663671175" MODIFIED="1435919335286">
<node TEXT="frontend: after selecting for lookup field, saveField must be called" ID="ID_1419094424" CREATED="1436110393500" MODIFIED="1436110408297"/>
<node TEXT="frontend: ListForm now uses data.rows[0] for the header section" ID="ID_1419571184" CREATED="1435673318570" MODIFIED="1435673335334"/>
<node TEXT="frontend: add drilldowns to listform" ID="ID_149198968" CREATED="1435663958459" MODIFIED="1435663965834"/>
<node TEXT="frontend: add scrolling to listform" ID="ID_1689836394" CREATED="1435663966160" MODIFIED="1435663972313"/>
<node TEXT="frontend: update count / sum after filtering" ID="ID_1002164671" CREATED="1435775466806" MODIFIED="1435775485986"/>
<node TEXT="frontend: streamline initial request by using ajax" ID="ID_587838158" CREATED="1435775497250" MODIFIED="1435775510097"/>
<node TEXT="frontend: revisit edit form" ID="ID_1656955817" CREATED="1435663974168" MODIFIED="1435663978868"/>
<node TEXT="frontend: update count after insert" ID="ID_160128588" CREATED="1435663980835" MODIFIED="1435664064870"/>
<node TEXT="implement delete" ID="ID_804335928" CREATED="1431870496548" MODIFIED="1435919335285"/>
<node TEXT="dao: calculatecalcfields(conditions...) and countbyconditions should probably move into daoset?" ID="ID_1935644299" CREATED="1435919369839" MODIFIED="1435919385726"/>
<node TEXT="fieldLinks: need clarification" ID="ID_220136488" CREATED="1435858136027" MODIFIED="1435858141904">
<node TEXT="under what circumstance can there ever be more than one?" ID="ID_542744221" CREATED="1435858142152" MODIFIED="1435858152638"/>
<node TEXT="currently, we&apos;re just using the first" ID="ID_669468957" CREATED="1435858155342" MODIFIED="1435858163145"/>
</node>
<node TEXT="table: use instanceof for determining field classes" ID="ID_1320547546" CREATED="1436015161559" MODIFIED="1436015244304">
<node TEXT="still does not work!!!" ID="ID_1866960159" CREATED="1436111141178" MODIFIED="1436111144603"/>
<node TEXT="create small isA() framework" ID="ID_821408512" CREATED="1436111145186" MODIFIED="1436111153061"/>
</node>
<node TEXT="bo: use real objects for references" ID="ID_37481252" CREATED="1436018546588" MODIFIED="1436018556452">
<node TEXT="e.g. customerBo in invoice for customerId" ID="ID_1247201555" CREATED="1436018556794" MODIFIED="1436018569704"/>
</node>
<node TEXT="dao: dao.calculateCalcfields() - remove conditions from params, if we are a primary dao... otherwise...???" ID="ID_1556723586" CREATED="1436019216756" MODIFIED="1436019289475"/>
<node TEXT="possible issue: lookupfield._options have string values because they are an object!!!" ID="ID_481762657" CREATED="1436029551137" MODIFIED="1436029591464"/>
<node TEXT="remove populatelookupfields from query result processing" ID="ID_1289840725" CREATED="1436103039186" MODIFIED="1436103050307"/>
<node TEXT="the way we curretnly avoid circular dependencies in table construction (with stuff in addLinks()) is clearly suboptimal" ID="ID_569725763" CREATED="1436103757312" MODIFIED="1436103785468"/>
<node TEXT="TESTS to create" ID="ID_799999024" CREATED="1436176760345" MODIFIED="1436176763330">
<node TEXT="webized fields of all kinds must still be json-able (nonrecursive)" ID="ID_624920653" CREATED="1436176763538" MODIFIED="1436176776466"/>
</node>
</node>
<node TEXT="Prio 2" ID="ID_64316623" CREATED="1435663675610" MODIFIED="1435663676834">
<node TEXT="frontend: openlookup might be suboptimal; should use real java object instead of stringified object" ID="ID_728537161" CREATED="1436108057676" MODIFIED="1436108082099">
<node TEXT="needs naming convention for the variable" ID="ID_1918564664" CREATED="1436108083250" MODIFIED="1436108094540"/>
</node>
<node TEXT="lookupfield: .clone might be suboptimal, what if user changes Field stuff between construction and cloning?" ID="ID_1528169891" CREATED="1436024303688" MODIFIED="1436024337016"/>
<node TEXT="test-app" ID="ID_799636667" CREATED="1430315839833" MODIFIED="1430315841342">
<node TEXT="customer/ invoices" ID="ID_1907447430" CREATED="1430315841734" MODIFIED="1430315846728"/>
<node TEXT="costs" ID="ID_376143007" CREATED="1430315847016" MODIFIED="1430315851573"/>
</node>
<node TEXT="frontend: design filters" ID="ID_876598995" CREATED="1435833751156" MODIFIED="1435833756334"/>
<node TEXT="test-app: add invoices" ID="ID_1770355614" CREATED="1435666530978" MODIFIED="1435666545758"/>
<node TEXT="test-app: add costs" ID="ID_1058617269" CREATED="1435666546174" MODIFIED="1435666548984"/>
<node TEXT="add method for sequences to dao(set?)" ID="ID_1234828434" CREATED="1435666584298" MODIFIED="1435666597155"/>
<node TEXT="add locking" ID="ID_547401360" CREATED="1435666625338" MODIFIED="1435666626991"/>
<node TEXT="add transactions" ID="ID_735663752" CREATED="1435666627223" MODIFIED="1435666630208"/>
<node TEXT="add visible/editable to fields" ID="ID_1168237780" CREATED="1435666637826" MODIFIED="1435666645518"/>
<node TEXT="null values when coming from form" ID="ID_958543010" CREATED="1432198757393" MODIFIED="1432198762670">
<node TEXT="should be config&apos;able per field" ID="ID_1729806340" CREATED="1435663770561" MODIFIED="1435663777038"/>
</node>
<node TEXT="queries: add additional aggregate/join queries" ID="ID_1593921330" CREATED="1435666661730" MODIFIED="1435666676013"/>
</node>
<node TEXT="Prio 3" ID="ID_1852199333" CREATED="1435663677286" MODIFIED="1435663679383">
<node TEXT="optimization: cache lookupfield options" ID="ID_32683467" CREATED="1435919298306" MODIFIED="1435919309328"/>
<node TEXT="secuirity: acheck against sql injection" ID="ID_1469007336" CREATED="1435666679893" MODIFIED="1435666690886"/>
<node TEXT="create some preprocessor for #ifdef" ID="ID_179422742" CREATED="1435664122057" MODIFIED="1435664132565"/>
<node TEXT="secuirity: acheck against xss" ID="ID_1037211750" CREATED="1435666679893" MODIFIED="1435666700082"/>
<node TEXT="server: fix error response" ID="ID_453376038" CREATED="1435762174278" MODIFIED="1435762180771"/>
</node>
</node>
<node TEXT="Wip" ID="ID_940167538" CREATED="1435663664218" MODIFIED="1435663666335"/>
<node TEXT="Done" ID="ID_314368932" CREATED="1435663666690" MODIFIED="1435663667460">
<node TEXT="resolve ambivalence" ID="ID_252337074" CREATED="1431782032915" MODIFIED="1431782039477">
<node TEXT="bo as object or as object-fetcher" ID="ID_866162368" CREATED="1431782039758" MODIFIED="1431782047152">
<node TEXT="boset" ID="ID_1879215516" CREATED="1431782061514" MODIFIED="1431782064169"/>
<node TEXT="bo" ID="ID_904312964" CREATED="1431782064421" MODIFIED="1431782065479"/>
</node>
<node TEXT="dao as object or as object-fetchr" ID="ID_1363264783" CREATED="1431782047372" MODIFIED="1431782054849">
<node TEXT="recordset" ID="ID_1424037263" CREATED="1431782055431" MODIFIED="1431782058465"/>
<node TEXT="record" ID="ID_1187107971" CREATED="1431782058700" MODIFIED="1431782059960">
<node TEXT="field getters/setters" ID="ID_248607712" CREATED="1431783521083" MODIFIED="1431783524868"/>
<node TEXT="loadById (if any)" ID="ID_612952630" CREATED="1431783527003" MODIFIED="1431783532350"/>
</node>
</node>
</node>
<node TEXT="frontend: add filters to listform" ID="ID_1625286015" CREATED="1435663937369" MODIFIED="1435663950612"/>
<node TEXT="frontend: addd conditions to listform" ID="ID_1795841236" CREATED="1435666555225" MODIFIED="1435666575856"/>
</node>
</node>
<node TEXT="Diary" POSITION="right" ID="ID_1729009659" CREATED="1430131954406" MODIFIED="1430131957064">
<edge COLOR="#00ffff"/>
<node TEXT="2015" ID="ID_964006408" CREATED="1430131958180" MODIFIED="1430131963120">
<node TEXT="04" ID="ID_1187779950" CREATED="1430131963508" MODIFIED="1430131964377">
<node TEXT="27" ID="ID_1341591784" CREATED="1430131965156" MODIFIED="1430131966718">
<node TEXT="wieder mal reingekippt" ID="ID_1320836215" CREATED="1430315698987" MODIFIED="1430315706211"/>
</node>
<node TEXT="29" ID="ID_1031889558" CREATED="1430315708788" MODIFIED="1430315710006">
<node TEXT="backend kann schon so einiges; fe und client-kommunikation noch extrem rudiment&#xe4;r" ID="ID_232588525" CREATED="1430315710582" MODIFIED="1430315729143"/>
</node>
</node>
<node TEXT="17" ID="ID_109029675" CREATED="1431870466833" MODIFIED="1431870475897">
<node TEXT="was soll passieren beim feld-&#xe4;ndern?" ID="ID_1896478868" CREATED="1431870476348" MODIFIED="1431870486749">
<node TEXT="update" ID="ID_1747475272" CREATED="1431870487071" MODIFIED="1431870488652"/>
<node TEXT="insert" ID="ID_1829084091" CREATED="1431870488932" MODIFIED="1431870489677"/>
<node TEXT="vom frontend aus" ID="ID_1029062556" CREATED="1431870546031" MODIFIED="1431870549137">
<node TEXT="saveField" ID="ID_1293311619" CREATED="1431870549459" MODIFIED="1431871304095">
<node TEXT="[ { name: ..., value: ... }, ..., currentField: name" ID="ID_1678217512" CREATED="1431871304696" MODIFIED="1431871335694"/>
</node>
</node>
<node TEXT="im backend" ID="ID_2190357" CREATED="1431871392951" MODIFIED="1431871394893">
<node TEXT="wenn id unleer" ID="ID_1858660533" CREATED="1431870667720" MODIFIED="1431870673576">
<node TEXT="loadById" ID="ID_1946214181" CREATED="1431870673833" MODIFIED="1431870676018"/>
</node>
<node TEXT="felder vom form dr&#xfc;bersetzen" ID="ID_915609873" CREATED="1431871427858" MODIFIED="1431871462976"/>
<node TEXT="feldValidatoren rufen" ID="ID_588650799" CREATED="1431871153561" MODIFIED="1431871173446">
<node TEXT="f&#xfc;r currentField" ID="ID_649571912" CREATED="1431871469528" MODIFIED="1431871471927"/>
</node>
<node TEXT="wenn gutgegangen" ID="ID_1316864335" CREATED="1431871524214" MODIFIED="1431871528111">
<node TEXT="wenn id unleer" ID="ID_1603947283" CREATED="1431871175494" MODIFIED="1431871181864">
<node TEXT="bo-validatoren rufen" ID="ID_437270923" CREATED="1431871184848" MODIFIED="1431871206412"/>
</node>
</node>
<node TEXT="wenn gutgegangen" ID="ID_606765180" CREATED="1431871687909" MODIFIED="1431871691976">
<node TEXT="speichern" ID="ID_755576089" CREATED="1431871692366" MODIFIED="1431871695771"/>
</node>
</node>
</node>
<node TEXT="autoSave + saveField" ID="ID_1449841197" CREATED="1432198430536" MODIFIED="1432198437089">
<node TEXT="sind alle required fields ausgef&#xfc;llt?" ID="ID_78787627" CREATED="1432198441292" MODIFIED="1432198464993"/>
<node TEXT="ich muss alle felder vom form holen" ID="ID_944256545" CREATED="1432198486292" MODIFIED="1432198491094">
<node TEXT="weil ich ja keinen halben datensatz speichern kann" ID="ID_1888516385" CREATED="1432198512148" MODIFIED="1432198520452"/>
</node>
<node TEXT="felder im form brauchen ein &quot;dirty&quot; flag" ID="ID_394469690" CREATED="1432198679599" MODIFIED="1432198686306">
<node TEXT="NEIN, sie sind entweder ausgef&#xfc;llt oder nicht" ID="ID_1855562146" CREATED="1432198711276" MODIFIED="1432198721639"/>
</node>
<node TEXT="&apos;&apos; = NULL???" ID="ID_1076353818" CREATED="1432198724684" MODIFIED="1432198729579">
<node TEXT="jetzt mal nein, ist ein TODO" ID="ID_1677446564" CREATED="1432198748087" MODIFIED="1432198754860"/>
</node>
</node>
</node>
</node>
</node>
</node>
</map>
